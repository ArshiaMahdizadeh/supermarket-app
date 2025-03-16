from django.urls import path
from .views import (
    CheckoutView,
    DeliveryTimesView,
    OrderDetailView,
    OrderListView,
    UpdateOrderStatusView,
)
urlpatterns = [
    path("orders/checkout/", CheckoutView.as_view(), name="checkout"),
    path("orders/", OrderListView.as_view(), name="order-list"),
    path("orders/<str:order_id>/", OrderDetailView.as_view(), name="order-detail"),
    path( "orders/<str:order_id>/update-status/",UpdateOrderStatusView.as_view(),name="update-order-status",),
    path("delivery-times/", DeliveryTimesView.as_view(), name="delivery-times"),
]
