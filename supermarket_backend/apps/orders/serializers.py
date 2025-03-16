from apps.products.serializers import ProductSerializer
from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["product", "quantity", "price", "total_price"]

    def get_total_price(self, obj):
        return obj.total_price


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "order_id",
            "user",
            "total",
            "status",
            "created_at",
            "updated_at",
            "items",
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "order_id",
            "status",
            "total",
            "created_at",
            "items",
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["timeline"] = [
            {
                "title": "Order Confirmed",
                "description": "Your order has been confirmed and will be processed shortly",
                "status": (
                    "completed"
                    if instance.status in ["processing", "delivered"]
                    else "upcoming"
                ),
                "timestamp": instance.created_at.isoformat(),
            },
            {
                "title": "Order Processed",
                "description": "Your items are being prepared for delivery",
                "status": (
                    "completed"
                    if instance.status in ["shipped", "delivered"]
                    else "upcoming"
                ),
                "timestamp": "Mar 14, 2024 2:15 PM",
            },
            {
                "title": "Out for Delivery",
                "description": "Your order is on its way to you",
                "status": "current" if instance.status == "shipped" else "upcoming",
                "timestamp": "Mar 15, 2024 8:45 AM",
            },
            {
                "title": "Delivered",
                "description": "Package has been delivered",
                "status": "completed" if instance.status == "delivered" else "upcoming",
                "timestamp": "Estimated: Mar 15, 2024 11:00 AM",
            },
        ]
        return representation
