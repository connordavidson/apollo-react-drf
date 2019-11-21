from django.db import models
from django.conf import settings
from django_countries.fields import CountryField
from django.db.models.signals import post_save

# Create your models here.

#these tuples are from django-react-boilerplate-master
CATEGORY_CHOICES = (
    ('T', 'Technology'),
    ('OD', 'Outdoors'),
    ('A', 'Apparel'),
    ('B', 'Books'),
    ('M', 'Miscelaneous'),


)

LABEL_CHOICES = (
    ('P', 'primary'),
    ('S', 'secondary'),
    ('D', 'danger')
)




class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    one_click_purchasing = models.BooleanField(default=False)
    email = models.CharField(max_length=30, null=True)
    def __str__(self):
        return self.user.username



class Item(models.Model):
    title = models.CharField(max_length=100)
    price = models.FloatField()
    discount_price = models.FloatField(blank=True, null=True)
    category = models.CharField(choices=CATEGORY_CHOICES, max_length=2)
    label = models.CharField(choices=LABEL_CHOICES, max_length=1)
    slug = models.SlugField()
    description = models.TextField()
    image = models.ImageField()
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("core:product", kwargs={
            'slug': self.slug
        })

    def get_add_to_cart_url(self):
        return reverse("core:add-to-cart", kwargs={
            'slug': self.slug
        })

    def get_remove_from_cart_url(self):
        return reverse("core:remove-from-cart", kwargs={
            'slug': self.slug
        })

#model for a review of an item. should have the user that reviewed it and the content of the review
class ItemReview(models.Model):
    #links the variation to the specific item that it is a variation of
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    #the foreign key has issues with linking to a user in the users table.
    #user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default='')
    user = models.CharField(max_length=25)
    review_content = models.CharField(max_length=250)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.review_content


#added this at https://youtu.be/Zg-bzjZuRa0?t=705
class Variation(models.Model):
    #links the variation to the specific item that it is a variation of
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    #name, size, color, etc could be possible options (depending on what the specific item is )
    name = models.CharField(max_length=50)


    #made at https://youtu.be/Zg-bzjZuRa0?t=950
    class Meta:
        #tuple of tuples
        unique_together = (
            #makes sure that the variation and the value are uniquely attached together. to make sure that there are no repeats for the item and variation options (ex. to make sure that there is not more than one variation that is for color for the same item)
            ('item' , 'name')
        )

    def __str__(self):
        return self.name


#added this at https://youtu.be/Zg-bzjZuRa0?t=736
class ItemVariation(models.Model):
    #links the item variation to the specific variation that it is linked to.. if the options are sm, md, lg, it is linked to the "size" variation
    variation = models.ForeignKey(Variation, on_delete=models.CASCADE)
    #different items for the variation (ie if the variation is a size variation, this would be sm, md, lg etc )
    value = models.CharField(max_length=50)
    #can display images of the different variations (ie, when they select a different color, present the image of that color to them )
    attachment = models.ImageField(blank=True)

    #the possible price difference of this variation... (if you buy a 32" tv over a 28", it'll be more expensive.. this is the value of this specific variation)
    #null because not every variation out there will be more expensive
    price = models.FloatField(blank=True, default=None )

    #made this class at https://youtu.be/Zg-bzjZuRa0?t=911
    class Meta:
        #tuple of tuples
        unique_together = (
            #makes sure that the variation and the value are uniquely attached together. to make sure that there is not more than one shirt variation that is for color
            ('variation' , 'value')
        )

    def __str__(self):
        return self.value


class OrderItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    ordered = models.BooleanField(default=False)

    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    #added around https://youtu.be/qJN1_2ZwqeA?t=173
    #double checks that there are all the variations for each item that is required for that item
    item_variations = models.ManyToManyField(ItemVariation)

    def __str__(self):
        return f"{self.quantity} of {self.item.title}"

    def get_total_item_price(self):
        return round( (self.quantity * self.item.price) , 2)

    def get_total_discount_item_price(self):
        return round( (self.quantity * self.item.discount_price) , 2)

    def get_amount_saved(self):
        return self.get_total_item_price() - self.get_total_discount_item_price()

    def get_final_price(self):
        if self.item.discount_price:
            return round( (self.get_total_discount_item_price() ) , 2)
        return round( (self.get_total_item_price()) , 2)




class Order(models.Model):
    #need to change this so that the order can be created if the user isn't logged in
    # (possibly store in state if they aren't logged in, then add them in checkout process if they decide to log in )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    #email = models.CharField(max_length=30, default='')
    ref_code = models.CharField(max_length=20, blank=True, null=True)
    items = models.ManyToManyField(OrderItem)
    start_date = models.DateTimeField(auto_now_add=True)
    ordered_date = models.DateTimeField()
    ordered = models.BooleanField(default=False)
    shipping_address = models.ForeignKey(
        'Address', related_name='shipping_address', on_delete=models.SET_NULL, blank=True, null=True)
    #the payment information is contained here
    payment = models.ForeignKey(
        'Payment', on_delete=models.SET_NULL, blank=True, null=True)
    coupon = models.ForeignKey(
        'Coupon', on_delete=models.SET_NULL, blank=True, null=True)
    being_delivered = models.BooleanField(default=False)
    tracking_number = models.CharField(null=True, max_length=24)
    received = models.BooleanField(default=False)
    refund_requested = models.BooleanField(default=False)
    refund_granted = models.BooleanField(default=False)


    '''
    1. Item added to cart
    2. Adding a billing address
    (Failed checkout)
    3. Payment
    (Preprocessing, processing, packaging etc.)
    4. Being delivered
    5. Received
    6. Refunds
    '''

    def __str__(self):
        return self.user.username

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_final_price()
        if self.coupon:
            total -= self.coupon.amount
        return round(total , 2)




class Address(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    street_address = models.CharField(max_length=100)
    apartment_address = models.CharField(max_length=100, blank=True)
    country = CountryField(multiple=False)
    zip = models.CharField(max_length=100)
    default = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name_plural = 'Addresses'

#will need to make slight changes when getting involved with the api (ex: might need to change payment_address max length, might need to make the payment_currency have at tuple of possible answers etc)
#should be stored every time a new order happens (this is not the same as storing someone's credit card information)
class Payment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.SET_NULL, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    #in usd
    amount_usd = models.FloatField()
    #type of currency they paid with (ex: btc, ltc, eth, etc)
    payment_currency = models.CharField(null=True, max_length=15)
    #in crypto
    amount_crypto = models.FloatField()
    #the usd/crypto exchange rate at the time of the order
    exchange_rate = models.FloatField()
    #the payment addres that they used (ex: a btc address)
    payment_address = models.CharField(null=True, max_length=44)
    #CHANGE THIS BASED ON THE PAYMENT API (ex: requested/seen on blockchain/recieved/high/low)
    payment_status = models.CharField(null=True, max_length=15)


    def __str__(self):
        return self.user.username


class Coupon(models.Model):
    code = models.CharField(max_length=15)
    #in usd
    amount = models.FloatField()

    def __str__(self):
        return self.code


class Refund(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    reason = models.TextField()
    accepted = models.BooleanField(default=False)
    email = models.EmailField()

    def __str__(self):
        return f"{self.pk}"



def userprofile_receiver(sender, instance, created, *args, **kwargs):
    if created:
        userprofile = UserProfile.objects.create(user=instance)

post_save.connect(userprofile_receiver, sender=settings.AUTH_USER_MODEL)




"""
MODELS FOR PROJECTS



"""
