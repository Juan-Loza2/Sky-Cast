
from rest_framework import serializers
from .models import ProductType, WeatherProduct, ProductCollection


class ProductTypeSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductType
        fields = [
            'id', 'code', 'name', 'description', 'color', 
            'product_count', 'created_at'
        ]
    
    def get_product_count(self, obj):
        return obj.products.filter(is_available=True).count()


class WeatherProductSerializer(serializers.ModelSerializer):
    product_type = ProductTypeSerializer(read_only=True)
    age_hours = serializers.ReadOnlyField()
    is_current = serializers.ReadOnlyField()
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = WeatherProduct
        fields = [
            'id', 'title', 'product_type', 'filename', 'file_url', 
            'file_format', 'file_size', 'generated_at', 'description', 
            'region', 'resolution', 'age_hours', 'is_current', 
            'thumbnail_url', 'created_at'
        ]
    
    def get_thumbnail_url(self, obj):
        return obj.get_thumbnail_url()


class WeatherProductDetailSerializer(WeatherProductSerializer):
    """Serializer detallado para vista individual de producto"""
    
    collections = serializers.SerializerMethodField()
    related_products = serializers.SerializerMethodField()
    
    class Meta(WeatherProductSerializer.Meta):
        fields = WeatherProductSerializer.Meta.fields + [
            'valid_from', 'valid_until', 'last_checked', 
            'collections', 'related_products'
        ]
    
    def get_collections(self, obj):
        collections = obj.collections.all()
        return ProductCollectionSerializer(collections, many=True).data
    
    def get_related_products(self, obj):
        # Productos del mismo tipo y fecha similar
        related = WeatherProduct.objects.filter(
            product_type=obj.product_type,
            is_available=True
        ).exclude(id=obj.id).order_by('-generated_at')[:5]
        
        return WeatherProductSerializer(related, many=True).data


class ProductCollectionSerializer(serializers.ModelSerializer):
    product_type = ProductTypeSerializer(read_only=True)
    product_count = serializers.ReadOnlyField()
    latest_product_date = serializers.ReadOnlyField()
    
    class Meta:
        model = ProductCollection
        fields = [
            'id', 'name', 'product_type', 'description', 'is_animation', 
            'animation_speed', 'product_count', 'latest_product_date', 
            'created_at'
        ]


class ProductCollectionDetailSerializer(ProductCollectionSerializer):
    """Serializer detallado para colección con productos incluidos"""
    
    products = WeatherProductSerializer(many=True, read_only=True)
    
    class Meta(ProductCollectionSerializer.Meta):
        fields = ProductCollectionSerializer.Meta.fields + ['products']


# Serializers para estadísticas y reportes
class ProductStatsSerializer(serializers.Serializer):
    """Serializer para estadísticas de productos"""
    
    total_products = serializers.IntegerField()
    available_products = serializers.IntegerField()
    products_by_type = serializers.DictField()
    recent_products_24h = serializers.IntegerField()
    oldest_product_date = serializers.DateTimeField()
    newest_product_date = serializers.DateTimeField()


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer para el dashboard principal"""
    
    summary = ProductStatsSerializer()
    recent_products = WeatherProductSerializer(many=True)
    types_stats = serializers.ListField(child=serializers.DictField())
    system_health = serializers.DictField()
