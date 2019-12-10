from django.urls import path

from .views import (
    ItemListView,
    ItemDetailView,
    AddToCartView,
    OrderDetailView,
    OrderItemDeleteView,
    OrderQuantityUpdateView,
    AddressListView,
    AddCouponView,
    CountryListView,
    ItemReviewsView,
    ItemSearchListView,
    AllOrdersView,
    AddToCartView,
    CategoryListView,
    ItemViewByCategoryListView,

)



urlpatterns = [
    path( 'products/', ItemListView.as_view(), name='product-list' ),
    path( 'categories/', CategoryListView.as_view(), name='category-list' ),
    path( 'products/search', ItemSearchListView.as_view(), name='product-search' ),
    path( 'products/<pk>/', ItemDetailView.as_view(), name='product-detail' ),
    path( 'add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path( 'order-summary/', OrderDetailView.as_view(), name='order-summary' ),
    path( 'all-orders/', AllOrdersView.as_view(), name='all-orders' ),
    path( 'order-items/<pk>/delete/', OrderItemDeleteView.as_view(), name='order-item-delete'),
    path( 'order-item/update-quantity/', OrderQuantityUpdateView.as_view(), name='order-item-update-quantity'),
    path( 'addresses/', AddressListView.as_view(), name='address-list'),
    path( 'add-coupon/', AddCouponView.as_view(), name='add-coupon'),
    path( 'countries/', CountryListView.as_view(), name='country-list' ),
    path( 'products/<pk>/reviews', ItemReviewsView.as_view(), name='product-reviews' ),
    path( 'product-search-by-category', ItemViewByCategoryListView.as_view(), name='product-search-by-category' ),
]
