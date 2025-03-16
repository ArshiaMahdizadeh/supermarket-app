from rest_framework import generics
from .models import Category
from .serializers import CategorySerializer, CategoryDetailSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = []

class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.all().prefetch_related('products')  
    serializer_class = CategoryDetailSerializer
    permission_classes = []
    lookup_field = 'slug'