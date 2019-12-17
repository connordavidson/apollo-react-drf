from django.contrib import admin

# Register your models here.
from .models import (
        Item,
        ItemVariation,
        Variation,
        OrderItem,
        Order,
        Address,
        #Refund,
        Coupon,
        Payment,
        ItemReview,
        OrderItem,
        ItemCategory,
        ItemSubCategory,
)


def make_refund_accepted(modeladmin, request, queryset):
    queryset.update(refund_requested=False, refund_granted=True)



#made at https://youtu.be/Zg-bzjZuRa0?t=1062
class ItemVariationInLineAdmin(admin.TabularInline):
    model = ItemVariation
    #only 1 extra row.. i'm assuming that this variable comes from admin.TabularInline
    extra = 1

#made at https://youtu.be/Zg-bzjZuRa0?t=1105
class VariationAdmin(admin.ModelAdmin):
    list_display = [
        'item',
        'name'
    ]

    list_filter = [
        'item'
    ]

    search_fields = [
        'name'
    ]

    inlines = [
        ItemVariationInLineAdmin
    ]


#made at https://youtu.be/Zg-bzjZuRa0?t=975
#this is for the admin site.
class ItemVariationAdmin(admin.ModelAdmin):
    list_display = [
        'variation',
        'value',
        'attachment'
    ]

    list_filter = [
        'variation',
        'variation__item'
    ]

    search_fields= [
        'value'
    ]



make_refund_accepted.short_description = 'Update orders to refund granted'


class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'ordered',
        'being_delivered',
        'received',
        'refund_requested',
        'refund_granted',
        'shipping_address',
        'payment',
        'coupon'
        ]
    list_display_links = [
        'user',
        'shipping_address',
        'payment',
        'coupon'
        ]
    list_filter = [
        'ordered',
        'being_delivered',
        'received',
        'refund_requested',
        'refund_granted'
        ]
    search_fields = [
        'user__username',
        'ref_code'
        ]
    actions = [make_refund_accepted]


class AddressAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'street_address',
        'apartment_address',
        'country',
        'zip',
        'default'
    ]
    list_filter = ['default', 'country']
    search_fields = ['user', 'street_address', 'apartment_address', 'zip']







#made at https://youtu.be/Zg-bzjZuRa0?t=1090
admin.site.register(ItemVariation, ItemVariationAdmin)
admin.site.register(Variation, VariationAdmin)
admin.site.register(Item)
admin.site.register(OrderItem)
admin.site.register(ItemReview)
admin.site.register(Order, OrderAdmin)
admin.site.register(Payment)
admin.site.register(Address, AddressAdmin)
admin.site.register(Coupon)
admin.site.register(ItemCategory)
admin.site.register(ItemSubCategory)
