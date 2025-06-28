
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useApi} from '../context/ApiContext';
import {WeatherProduct} from '../types/api';
import {COLORS, SIZES, SHADOWS} from '../constants/theme';
import {RootStackParamList} from '../navigation/AppNavigator';

import ProductCard from '../components/ProductCard';
import ProductTypeCard from '../components/ProductTypeCard';
import LoadingShimmer from '../components/LoadingShimmer';
import EmptyState from '../components/EmptyState';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    productTypes,
    loadingStates,
    fetchProductTypes,
    fetchLatestProducts,
    refreshData,
  } = useApi();

  const [latestProducts, setLatestProducts] = useState<WeatherProduct[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingLatest, setLoadingLatest] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoadingLatest(true);
      await fetchProductTypes();
      const latest = await fetchLatestProducts(5);
      setLatestProducts(latest);
    } catch (error) {
      console.error('Error loading initial data:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los datos. Verifica tu conexión a internet.',
      );
    } finally {
      setLoadingLatest(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshData();
      const latest = await fetchLatestProducts(5);
      setLatestProducts(latest);
    } catch (error) {
      console.error('Error refreshing:', error);
      Alert.alert('Error', 'No se pudieron actualizar los datos.');
    } finally {
      setRefreshing(false);
    }
  };

  const navigateToProductDetail = (productId: number) => {
    navigation.navigate('ProductDetail', {productId});
  };

  const navigateToProducts = () => {
    navigation.navigate('MainTabs', {screen: 'Products'});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        
        {/* Header de bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            Observatorio Hidrometeorológico
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Productos meteorológicos en tiempo real
          </Text>
        </View>

        {/* Sección de tipos de productos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tipos de Productos</Text>
            <TouchableOpacity onPress={navigateToProducts}>
              <Text style={styles.sectionLink}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {loadingStates.productTypes.isLoading ? (
            <View style={styles.typesGrid}>
              {[1, 2, 3, 4].map(i => (
                <LoadingShimmer key={i} width="45%" height={80} />
              ))}
            </View>
          ) : productTypes.length > 0 ? (
            <View style={styles.typesGrid}>
              {productTypes.slice(0, 4).map(type => (
                <ProductTypeCard
                  key={type.id}
                  productType={type}
                  onPress={() => {
                    // Navegar a productos filtrados por tipo
                    navigation.navigate('MainTabs', {
                      screen: 'Products',
                      params: {filterByType: type.code}
                    });
                  }}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              icon="weather-cloudy-alert"
              title="Sin tipos de productos"
              message="No se encontraron tipos de productos disponibles."
            />
          )}
        </View>

        {/* Sección de productos recientes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Productos Recientes</Text>
            <TouchableOpacity onPress={navigateToProducts}>
              <Icon name="arrow-right" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {loadingLatest ? (
            <View>
              {[1, 2, 3].map(i => (
                <LoadingShimmer key={i} height={120} style={styles.productShimmer} />
              ))}
            </View>
          ) : latestProducts.length > 0 ? (
            <View>
              {latestProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => navigateToProductDetail(product.id)}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              icon="weather-cloudy-alert"
              title="Sin productos recientes"
              message="No se encontraron productos meteorológicos recientes."
            />
          )}
        </View>

        {/* Información adicional */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Icon name="information" size={24} color={COLORS.info} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Datos en tiempo real</Text>
              <Text style={styles.infoDescription}>
                Los productos se actualizan automáticamente desde el servidor OHMC.
              </Text>
            </View>
          </View>
        </View>

        {/* Espaciado inferior */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  welcomeSection: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    marginBottom: SIZES.md,
  },
  welcomeTitle: {
    fontSize: SIZES.text3xl,
    fontWeight: 'bold',
    color: COLORS.surface,
    textAlign: 'center',
    marginBottom: SIZES.xs,
  },
  welcomeSubtitle: {
    fontSize: SIZES.textLg,
    color: COLORS.surface,
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: SIZES.screenPadding,
    marginBottom: SIZES.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.text2xl,
    fontWeight: '600',
    color: COLORS.text,
  },
  sectionLink: {
    fontSize: SIZES.textMd,
    color: COLORS.primary,
    fontWeight: '500',
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SIZES.md,
  },
  productShimmer: {
    marginBottom: SIZES.md,
  },
  infoSection: {
    paddingHorizontal: SIZES.screenPadding,
    marginBottom: SIZES.xl,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.cardRadius,
    padding: SIZES.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...SHADOWS.small,
  },
  infoText: {
    flex: 1,
    marginLeft: SIZES.md,
  },
  infoTitle: {
    fontSize: SIZES.textLg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  infoDescription: {
    fontSize: SIZES.textMd,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: SIZES.xl,
  },
});

export default HomeScreen;
