from django.urls import path
from .views import CartView, AddToCartView, RemoveFromCartView, UpdateCartItemView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart-detail'),
    path('cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('cart/remove/<int:cart_item_id>/', RemoveFromCartView.as_view(), name='remove-from-cart'),
    path('cart/update/<int:cart_item_id>/', UpdateCartItemView.as_view(), name='update-cart-item'),
]