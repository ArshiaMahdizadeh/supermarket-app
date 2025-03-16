from apps.products.models import Product
from django.db.models import Prefetch
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Cart, CartItem
from .serializers import CartItemSerializer, CartSerializer


class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        
        cart, created = Cart.objects.get_or_create(
            user=self.request.user, defaults={"user": self.request.user}
        )
        cart.items.prefetch_related("product")  
        return cart



class AddToCartView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        if not product_id:
            return Response(
                {"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
            )

        
        cart, _ = Cart.objects.get_or_create(user=request.user)

        
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not created:
            
            if "set_quantity" in request.data:
                
                cart_item.quantity = int(request.data["set_quantity"])
            else:
                
                cart_item.quantity += quantity
        else:
            
            cart_item.quantity = quantity

        
        cart_item.quantity = max(1, cart_item.quantity)
        cart_item.save()

        return Response(
            {"message": "Product added to cart"}, status=status.HTTP_201_CREATED
        )

class RemoveFromCartView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        cart_item_id = kwargs.get("cart_item_id")

        if not cart_item_id:
            return Response(
                {"error": "Cart item ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            
            cart_item = CartItem.objects.select_related("cart").get(
                id=cart_item_id, cart__user=request.user
            )
            cart_item.delete()
            return Response(
                {"message": "Product removed from cart"},
                status=status.HTTP_204_NO_CONTENT,
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND
            )



class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        cart_item_id = kwargs.get("cart_item_id")
        quantity = request.data.get("quantity")

        
        if not cart_item_id:
            return Response(
                {"error": "Cart item ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        
        try:
            quantity = int(quantity)  
            if quantity < 1:
                raise ValueError("Quantity must be at least 1")
        except (ValueError, TypeError):
            return Response(
                {"error": "Valid quantity is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        
        try:
            cart_item = CartItem.objects.select_related("cart").get(
                id=cart_item_id, cart__user=request.user
            )
        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"}, status=status.HTTP_404_NOT_FOUND
            )

        
        cart_item.quantity = max(1, quantity)  
        cart_item.save()

        return Response({"message": "Cart item updated"}, status=status.HTTP_200_OK)