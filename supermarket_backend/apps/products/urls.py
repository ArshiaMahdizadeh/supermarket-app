from django.urls import path
from .views import (
    ProductListView, ProductDetailView, ProductSearchView, RelatedProductsView,
    ProductReviewsView, CreateProductView, UpdateProductView, DeleteProductView
)

urlpatterns = [
    # Public endpoints
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:id>/', ProductDetailView.as_view(), name='product-detail'),
    path('products/<int:id>/related/', RelatedProductsView.as_view(), name='related-products'),
    path('products/<int:id>/reviews/', ProductReviewsView.as_view(), name='product-reviews'),
     path('products/search/', ProductSearchView.as_view(), name='product-search'),

    # Admin-only endpoints
    path('admin/products/create/', CreateProductView.as_view(), name='create-product'),
    path('admin/products/<int:id>/update/', UpdateProductView.as_view(), name='update-product'),
    path('admin/products/<int:id>/delete/', DeleteProductView.as_view(), name='delete-product'),
]