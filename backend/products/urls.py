
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductTypeViewSet, WeatherProductViewSet, ProductCollectionViewSet

# Router para las APIs
router = DefaultRouter()
router.register(r'tipos', ProductTypeViewSet, basename='producttype')
router.register(r'productos', WeatherProductViewSet, basename='weatherproduct')
router.register(r'colecciones', ProductCollectionViewSet, basename='productcollection')

urlpatterns = [
    path('', include(router.urls)),
]
