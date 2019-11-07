from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django_countries import countries

from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST


from .serializers import (
    ItemSerializer,
    ItemDetailSerializer,
    AddressSerializer,
    OrderSerializer,
)

from .models import (
    Item,
    UserProfile,
    Address,
    OrderItem,
    Order,
    Variation,
    ItemVariation
)

# Create your views here.

class ItemListView(ListAPIView):
    permission_classes = (AllowAny, )
    serializer_class = ItemSerializer
    queryset = Item.objects.all()


class UserIDView(APIView):
    def get(self, request, *args, **kwargs):
        return Response({'userID': request.user.id }, status=HTTP_200_OK)


#created at https://youtu.be/Zg-bzjZuRa0?t=175
class ItemDetailView(RetrieveAPIView):
    permission_classes = (AllowAny, )
    serializer_class = ItemDetailSerializer
    queryset = Item.objects.all()



#created at https://youtu.be/0JOl3ckfGAM?list=PLLRM7ROnmA9Hp8j_1NRCK6pNVFfSf4G7a&t=290 ish
class AddToCartView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        #added at https://youtu.be/qJN1_2ZwqeA?t=1470
        #if it is [] then that means there were not enough variatins in place for it to be a valid "add-to-cart" action
        variations = request.data.get('variations', [])
        print("variations: " + str(variations) )

        quantity = 1

        if request.data.get('quantity') is not None:
            quantity = int( request.data.get('quantity') )

        print('quantity: ' + str(quantity))
        if slug is None:
            return Response( { "message": "Invalid request, slug = None"}, status=HTTP_400_BAD_REQUEST )
        #this is what happens if there is a Slug
        item = get_object_or_404(Item, slug=slug)

        #made at https://youtu.be/qJN1_2ZwqeA?t=1600
        #checks that the number of variations in the "added item" is equal to the number that are required (that a color and a size are selected for a shirt)
        minimum_variation_count = Variation.objects.filter(item=item).count()
        if len(variations) < minimum_variation_count:
            return Response( { "message": "Please specify the required variations"}, status=HTTP_400_BAD_REQUEST )

        #edited around https://youtu.be/qJN1_2ZwqeA?t=1598
        #filters the order item objects by the parameters
        order_item_qs = OrderItem.objects.filter(
            item=item,
            user=request.user,
            ordered=False
        )

        #made at https://youtu.be/qJN1_2ZwqeA?t=1757
        #checks if there is already an item with those variations (for incrementing that object in the order, or for adding a new item to the order)
        for v in variations:
            order_item_qs = order_item_qs.filter(
                item_variations__exact = v
            )

        #created at https://youtu.be/qJN1_2ZwqeA?t=1800
        #if that item with the specific variations exists, increase the quantity of that item in the cart by 1
        if order_item_qs.exists():
            order_item = order_item_qs.first()

            print('quantity: ' + str(quantity))
            order_item.quantity += quantity
            print('quantity: ' + str(quantity))

            order_item.save()
        #if it doesn't exist in the cart, add the new item to the cart
        else:
            order_item = OrderItem.objects.create(
                item=item,
                user=request.user,
                ordered=False,
                quantity=quantity,
                
            )
            #adds the variations to the order. (the * means all and means we don't have to loop through it. ex: for each variation)
            order_item.item_variations.add(*variations)
            order_item.save()

        #make changes at https://youtu.be/qJN1_2ZwqeA?t=1900
        order_qs = Order.objects.filter(user=request.user, ordered=False)
        if order_qs.exists():
            #it is index 0 because the user can only have 1 unordered order (how many websites have you been to that let you have multiple carts? 0, boiiii)
            order = order_qs[0]
            # check if the order item is in the order
            #   if the order doesn't contain the item with order_item.id, add it to the cart (it filters it and then checks if there are 0 results after the filter)
            if not order.items.filter(item__id=order_item.id).exists():
                order.items.add(order_item)
            #returns responses from the framework
            return Response( status=HTTP_200_OK )

        #if the order doesn't already exist, make a new one
        else:
            ordered_date = timezone.now()
            order = Order.objects.create(
                user=request.user, ordered_date=ordered_date)
            #adds this item to the new order
            order.items.add(order_item)
            #returns responses from the framework
            return Response(status=HTTP_200_OK)


#created at https://youtu.be/0JOl3ckfGAM?list=PLLRM7ROnmA9Hp8j_1NRCK6pNVFfSf4G7a&t=1574
class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated, )

    def get_object(self):
        try:
            #looks in the Order table and returns all the orders where user = current user and ordered = False
            order = Order.objects.get(user=self.request.user, ordered=False)
            return order
        #if there is no order
        except ObjectDoesNotExist:
            #changed this response at https://youtu.be/Vm9Z6mm2kcU?t=149
            raise Http404("You do not have an active order")


#made at https://youtu.be/8UEZsm4tCpY?t=205
class OrderItemDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = OrderItem.objects.all()


#made at https://youtu.be/8UEZsm4tCpY?t=975
class OrderQuantityUpdateView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        if slug is None:
            return Response({"message": "Invalid Data"}, status=HTTP_400_BAD_REQUEST)
        item = get_object_or_404(Item, slug=slug)
        #get the order and filter based on the current user
        order_qs = Order.objects.filter(
            user=request.user,
            ordered=False
        )
        #if the order exists
        if order_qs.exists():
            order = order_qs[0]
            # check if the order item is in the order
            if order.items.filter(item__slug=item.slug).exists():
                #filters by the item and the user
                order_item = OrderItem.objects.filter(
                    item=item,
                    user=request.user,
                    ordered=False
                )[0]
                #if the quantity is greater than 1, decrement. quantity is 1, remove
                if order_item.quantity > 1:
                    order_item.quantity -= 1
                    order_item.save()
                else:
                    order.items.remove(order_item)
                return Response(status=HTTP_200_OK)
            else:
                return Response({"message": "This item was not in your cart"}, status=HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)




#will need to change this to work with payment api

#created at https://youtu.be/z7Kq6bHxEcI?t=829
class PaymentView(APIView):

    def post(self, request, *args, **kwargs):


        order = Order.objects.get(user=self.request.user, ordered=False)

        userprofile = UserProfile.objects.get(user=self.request.user)

        token = request.data.get('stripeToken') #stripeToken comes from Checkout.js
        #added at https://youtu.be/NaJ-b0ZaSoI?t=1275
        billing_address_id = request.data.get('selectedBillingAddress')
        shipping_address_id = request.data.get('selectedShippingAddress')

        billing_address = Address.objects.get(id=billing_address_id)
        shipping_address = Address.objects.get(id=shipping_address_id)

        amount = int(order.get_total() * 100)

        try:

            # assign the payment to the order
            order_items = order.items.all()
            order_items.update(ordered=True)
            for item in order_items:
                item.save()

            order.ordered = True
            # order.payment = payment

            #made at https://youtu.be/NaJ-b0ZaSoI?t=1405
            order.shipping_address = shipping_address

            #order.ref_code = create_ref_code()
            order.save()

            #if the order gets placed correctly
            return Response(status=HTTP_200_OK)

        except Exception as e:
            # send an email to ourselves
            print(e)
            return Response( { 'message': "A serious error has occurred. We have been notified." } , status=HTTP_400_BAD_REQUEST)

        return Response( { 'message': "Invalid data" } , status=HTTP_400_BAD_REQUEST)
