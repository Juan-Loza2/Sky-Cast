
import React, {createContext, useContext, useState, useCallback} from 'react';
import {
  ApiContextType,
  WeatherProduct,
  WeatherProductDetail,
  ProductType,
  ProductFilters,
  LoadingState,
  DateGroupedProducts,
} from '../types/api';
import {apiService} from '../services/apiService';

const initialLoadingState: LoadingState = {
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  // Estados principales
  const [products, setProducts] = useState<WeatherProduct[]>([]);
  const [productDetail, setProductDetail] = useState<WeatherProductDetail | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  
  // Estados de carga
  const [loadingStates, setLoadingStates] = useState({
    products: initialLoadingState,
    productTypes: initialLoadingState,
    productDetail: initialLoadingState,
  });

  // Utilidad para actualizar estado de carga
  const updateLoadingState = useCallback(
    (key: keyof typeof loadingStates, update: Partial<LoadingState>) => {
      setLoadingStates(prev => ({
        ...prev,
        [key]: {...prev[key], ...update},
      }));
    },
    [],
  );

  // Fetch productos con filtros
  const fetchProducts = useCallback(
    async (filters?: ProductFilters) => {
      updateLoadingState('products', {isLoading: true, error: null});
      
      try {
        const response = await apiService.getProducts(filters);
        setProducts(response.results);
        updateLoadingState('products', {
          isLoading: false,
          lastUpdated: new Date(),
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        updateLoadingState('products', {
          isLoading: false,
          error: errorMessage,
        });
        throw error;
      }
    },
    [updateLoadingState],
  );

  // Fetch detalle de producto
  const fetchProductDetail = useCallback(
    async (id: number) => {
      updateLoadingState('productDetail', {isLoading: true, error: null});
      
      try {
        const product = await apiService.getProductDetail(id);
        setProductDetail(product);
        updateLoadingState('productDetail', {
          isLoading: false,
          lastUpdated: new Date(),
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        updateLoadingState('productDetail', {
          isLoading: false,
          error: errorMessage,
        });
        throw error;
      }
    },
    [updateLoadingState],
  );

  // Fetch tipos de productos
  const fetchProductTypes = useCallback(async () => {
    updateLoadingState('productTypes', {isLoading: true, error: null});
    
    try {
      const types = await apiService.getProductTypes();
      setProductTypes(types);
      updateLoadingState('productTypes', {
        isLoading: false,
        lastUpdated: new Date(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      updateLoadingState('productTypes', {
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [updateLoadingState]);

  // Fetch últimos productos
  const fetchLatestProducts = useCallback(
    async (limit = 10): Promise<WeatherProduct[]> => {
      try {
        return await apiService.getLatestProducts(limit);
      } catch (error) {
        console.error('Error fetching latest products:', error);
        throw error;
      }
    },
    [],
  );

  // Fetch productos recientes
  const fetchRecentProducts = useCallback(
    async (hours = 24): Promise<WeatherProduct[]> => {
      try {
        const response = await apiService.getRecentProducts(hours);
        return response.results;
      } catch (error) {
        console.error('Error fetching recent products:', error);
        throw error;
      }
    },
    [],
  );

  // Fetch productos por fecha
  const fetchProductsByDate = useCallback(
    async (date: string): Promise<DateGroupedProducts> => {
      try {
        return await apiService.getProductsByDate(date);
      } catch (error) {
        console.error('Error fetching products by date:', error);
        throw error;
      }
    },
    [],
  );

  // Limpiar detalle de producto
  const clearProductDetail = useCallback(() => {
    setProductDetail(null);
    setLoadingStates(prev => ({
      ...prev,
      productDetail: initialLoadingState,
    }));
  }, []);

  // Refrescar todos los datos
  const refreshData = useCallback(async () => {
    try {
      await Promise.all([
        fetchProducts(),
        fetchProductTypes(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
      throw error;
    }
  }, [fetchProducts, fetchProductTypes]);

  const contextValue: ApiContextType = {
    // Estados
    products,
    productDetail,
    productTypes,
    loadingStates,
    
    // Métodos
    fetchProducts,
    fetchProductDetail,
    fetchProductTypes,
    fetchLatestProducts,
    fetchRecentProducts,
    fetchProductsByDate,
    clearProductDetail,
    refreshData,
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
