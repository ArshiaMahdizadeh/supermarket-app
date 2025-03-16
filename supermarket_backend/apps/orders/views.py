from apps.cart.models import Cart, CartItem
from rest_framework import generics, status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Order, OrderItem
from .serializers import OrderDetailSerializer, OrderSerializer


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Order.objects.filter(user=self.request.user)
        print("QuerySet:", queryset)
        print("Serialized Data:", OrderSerializer(queryset, many=True).data)
        return queryset


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]
    lookup_field = "order_id"

    def get(self, request, order_id):
        try:
            order = Order.objects.get(order_id=order_id, user=request.user)
            serializer = OrderDetailSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found"}, status=404)


class CheckoutView(CreateAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        pass

    def post(self, request, *args, **kwargs):
        user = request.user
        cart = Cart.objects.filter(user=user).first()
        print(user, cart)

        if not cart or not cart.items.exists():
            return Response(
                {"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST
            )

        promo_code = request.data.get("promo_code")
        total = sum(item.total_price for item in cart.items.all())
        discount = 0

        if promo_code == "DISCOUNT20":
            discount = total * 0.2
            total -= discount

        order = Order.objects.create(
            user=user,
            order_id=f"ORD-{user.id}-{Order.objects.count() + 1}",
            total=total,
            status="pending",
        )

        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price,
            )

        cart.items.all().delete()

        return Response(
            {
                "message": "Order created successfully",
                "order_id": order.order_id,
                "total": total,
                "discount": discount,
            },
            status=status.HTTP_201_CREATED,
        )


class UpdateOrderStatusView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        order_id = kwargs.get("order_id")
        status = request.data.get("status")

        try:
            order = Order.objects.get(order_id=order_id)
            order.status = status
            order.save()
            return Response(
                {"message": "Order status updated"}, status=status.HTTP_200_OK
            )
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND
            )


class DeliveryTimesView(APIView):
    def get(self, request, *args, **kwargs):

        delivery_times = [
            {"id": 1, "time": "9:00 AM - 11:00 AM", "available": True},
            {"id": 2, "time": "11:00 AM - 1:00 PM", "available": True},
            {"id": 3, "time": "2:00 PM - 4:00 PM", "available": True},
            {"id": 4, "time": "4:00 PM - 6:00 PM", "available": False},
        ]
        return Response(delivery_times, status=status.HTTP_200_OK)
