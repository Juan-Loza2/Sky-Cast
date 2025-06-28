
export interface ProductType {
  id: number;
  code: string;
  name: string;
  description: string;
  color: string;
  product_count: number;
  created_at: string;
}

export interface WeatherProduct {
  id: number;
  title: string;
  product_type: ProductType;
  filename: string;
  file_url: string;
  file_format: string;
  file_size: number;
  generated_at: string;
  description: string;
  region: string;
  resolution: string;
  age_hours: number;
  is_current: boolean;
  thumbnail_url: string;
  created_at: string;
}

export interface WeatherProductDetail extends WeatherProduct {
  valid_from?: string;
  valid_until?: string;
  last_checked: string;
  collections: ProductCollection[];
  related_products: WeatherProduct[];
}

export interface ProductCollection {
  id: number;
  name: string;
  product_type: ProductType;
  description: string;
  is_animation: boolean;
  animation_speed: number;
  product_count: number;
  latest_product_date: string;
  created_at: string;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ProductStats {
  type: ProductType;
  product_count: number;
  latest_product: {
    id: number;
    title: string;
    generated_at: string;
    age_hours: number;
  } | null;
}

export interface DateGroupedProducts {
  date: string;
  groups: {
    type: ProductType;
    products: WeatherProduct[];
  }[];
  total_products: number;
}

// Parámetros de filtrado
export interface ProductFilters {
  tipo?: string;
  tipo_codigo?: string;
  fecha?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  formato?: string;
  region?: string;
  disponible?: boolean;
  max_horas?: number;
  buscar?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

// Estados de carga
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

// Context de la API
export interface ApiContextType {
  // Productos
  products: WeatherProduct[];
  productDetail: WeatherProductDetail | null;
  
  // Tipos
  productTypes: ProductType[];
  
  // Estados de carga
  loadingStates: {
    products: LoadingState;
    productTypes: LoadingState;
    productDetail: LoadingState;
  };
  
  // Métodos
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProductDetail: (id: number) => Promise<void>;
  fetchProductTypes: () => Promise<void>;
  fetchLatestProducts: (limit?: number) => Promise<WeatherProduct[]>;
  fetchRecentProducts: (hours?: number) => Promise<WeatherProduct[]>;
  fetchProductsByDate: (date: string) => Promise<DateGroupedProducts>;
  
  // Utilidades
  clearProductDetail: () => void;
  refreshData: () => Promise<void>;
}
