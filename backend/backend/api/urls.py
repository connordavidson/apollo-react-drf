from django.urls import path

from .views import (
    ItemListView,
    ItemDetailView,
    AddToCartView,
    OrderDetailView,
    OrderItemDeleteView,
    
)



urlpatterns = [
    path( 'products/', ItemListView.as_view(), name='product-list' ),
    path( 'products/<pk>/', ItemDetailView.as_view(), name='product-detail' ),
    path( 'add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path( 'order-summary/', OrderDetailView.as_view(), name='order-summary' ),
    path( 'order-items/<pk>/delete/', OrderItemDeleteView.as_view(), name='order-item-delete'),

]
