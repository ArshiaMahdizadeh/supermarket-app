from rest_framework import generics, permissions
from .models import Product, Review
from .serializers import ProductSerializer, RelatedProductSerializer, ReviewSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'

class RelatedProductsView(generics.ListAPIView):
    serializer_class = RelatedProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        product_id = self.kwargs['id']
        product = Product.objects.get(id=product_id)
        return Product.objects.exclude(id=product_id).filter(category=product.category)[:5]

class ProductReviewsView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        product_id = self.kwargs['id']
        return Review.objects.filter(product_id=product_id)

class CreateProductView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]

class UpdateProductView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'id'

class DeleteProductView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'id'
    
    
    
class ProductSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        query = request.query_params.get("q", "").strip()
        if not query:
            return Response([])

        
        products = Product.objects.filter(name__icontains=query)[:10]  
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)