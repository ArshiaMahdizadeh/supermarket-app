from django.contrib import admin
from .models import Product, Review

class ReviewInline(admin.TabularInline):
    model = Review
    extra = 1  

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'rating', 'organic', 'origin')
    list_filter = ('organic', 'origin')
    search_fields = ('name', 'description')
    inlines = [ReviewInline]  

admin.site.register(Product, ProductAdmin)
admin.site.register(Review)