
import axios, {AxiosInstance, AxiosResponse} from 'axios';
import {
  WeatherProduct,
  WeatherProductDetail,
  ProductType,
  ApiResponse,
  ProductFilters,
  ProductStats,
  DateGroupedProducts,
} from '../types/api';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:8000/api';
const API_TIMEOUT = 10000;

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Interceptor para requests
    this.client.interceptors.request.use(
      config => {
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      error => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      },
    );

    // Interceptor para responses
    this.client.interceptors.response.use(
      response => {
        console.log(
          `✅ API Response: ${response.status} ${response.config.url}`,
        );
        return response;
      },
      error => {
        console.error('❌ Response Error:', error);
        
        if (error.response) {
          // Error del servidor
          const message = error.response.data?.message || error.response.data?.detail || 'Error del servidor';
          throw new Error(`${error.response.status}: ${message}`);
        } else if (error.request) {
          // Error de red
          throw new Error('Error de conexión. Verifique su conexión a internet.');
        } else {
          // Error de configuración
          throw new Error('Error de configuración de la solicitud.');
        }
      },
    );
  }

  // Utilidad para construir query string
  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }

  // ========== PRODUCTOS ==========

  async getProducts(filters?: ProductFilters): Promise<ApiResponse<WeatherProduct>> {
    const queryString = filters ? this.buildQueryString(filters) : '';
    const url = `/productos/${queryString ? `?${queryString}` : ''}`;
    
    const response: AxiosResponse<ApiResponse<WeatherProduct>> = await this.client.get(url);
    return response.data;
  }

  async getProductDetail(id: number): Promise<WeatherProductDetail> {
    const response: AxiosResponse<WeatherProductDetail> = await this.client.get(
      `/productos/${id}/`,
    );
    return response.data;
  }

  async getLatestProducts(limit = 10): Promise<WeatherProduct[]> {
    const response: AxiosResponse<WeatherProduct[]> = await this.client.get(
      `/productos/ultimos/?limit=${limit}`,
    );
    return response.data;
  }

  async getRecentProducts(hours = 24): Promise<ApiResponse<WeatherProduct>> {
    const response: AxiosResponse<ApiResponse<WeatherProduct>> = await this.client.get(
      `/productos/recientes/?hours=${hours}`,
    );
    return response.data;
  }

  async getProductsByDate(date: string): Promise<DateGroupedProducts> {
    const response: AxiosResponse<DateGroupedProducts> = await this.client.get(
      `/productos/por_fecha/?fecha=${date}`,
    );
    return response.data;
  }

  // ========== TIPOS DE PRODUCTOS ==========

  async getProductTypes(): Promise<ProductType[]> {
    const response: AxiosResponse<ProductType[]> = await this.client.get('/tipos/');
    return response.data;
  }

  async getProductTypeStats(): Promise<ProductStats[]> {
    const response: AxiosResponse<ProductStats[]> = await this.client.get('/tipos/stats/');
    return response.data;
  }

  // ========== UTILIDADES ==========

  async checkHealth(): Promise<{status: string; service: string}> {
    const response = await this.client.get('/health/');
    return response.data;
  }

  // Método para actualizar la base URL (útil para testing o diferentes entornos)
  updateBaseURL(url: string): void {
    this.client.defaults.baseURL = url;
  }

  // Método para obtener configuración actual
  getConfig() {
    return {
      baseURL: this.client.defaults.baseURL,
      timeout: this.client.defaults.timeout,
    };
  }
}

// Instancia singleton del servicio
export const apiService = new ApiService();

// Export default para compatibilidad
export default apiService;
