import { Observable } from 'rxjs';
import { Params } from '@angular/router';

/**
 * Adapter for mapping filters to/from URL parameters
 *
 * @template TFilters - The shape of the filter object
 */
export interface IFilterUrlMapper<TFilters> {
  /**
   * Convert filters to URL query parameters
   */
  toUrlParams(filters: TFilters): Params;

  /**
   * Convert URL query parameters to filters
   */
  fromUrlParams(params: Params): TFilters;

  /**
   * Extract highlight filters from URL parameters (optional)
   */
  extractHighlights?(params: Params): any;
}

/**
 * Response from API adapter
 */
export interface ApiAdapterResponse<TData, TStatistics = any> {
  results: TData[];
  total: number;
  statistics?: TStatistics;
}

/**
 * Adapter for fetching data from API
 */
export interface IApiAdapter<TFilters, TData, TStatistics = any> {
  fetchData(
    filters: TFilters,
    highlights?: any
  ): Observable<ApiAdapterResponse<TData, TStatistics>>;
}

/**
 * Adapter for building cache keys from filters
 */
export interface ICacheKeyBuilder<TFilters> {
  buildKey(filters: TFilters, highlights?: any): string;
}

/**
 * Generic API response interface for paginated endpoints
 */
export interface ApiResponse<TData> {
  results: TData[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  statistics?: any;
}

/**
 * Generic error response from API
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

/**
 * Generic success response wrapper
 */
export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
}

/**
 * Standard API response type (success or error)
 */
export type StandardApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;

/**
 * Options for API requests
 */
export interface ApiRequestOptions {
  params?: Record<string, any>;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

/**
 * Abstract API service interface.
 * Implemented by state-management's ApiService.
 * Used by GenericApiAdapter so config doesn't depend on state-management.
 */
export interface IApiService {
  get<TData>(endpoint: string, options?: ApiRequestOptions): Observable<ApiResponse<TData>>;
}

/**
 * Configuration for ResourceManagementService
 */
export interface ResourceManagementConfig<TFilters, TData, TStatistics = any> {
  filterMapper: IFilterUrlMapper<TFilters>;
  apiAdapter: IApiAdapter<TFilters, TData, TStatistics>;
  cacheKeyBuilder: ICacheKeyBuilder<TFilters>;
  defaultFilters: TFilters;
  autoFetch?: boolean;
  cacheTTL?: number;
  /** @deprecated Use IFilterUrlMapper.extractHighlights() instead. */
  supportsHighlights?: boolean;
  /** @deprecated Use IFilterUrlMapper.extractHighlights() instead. */
  highlightPrefix?: string;
}

/**
 * State managed by ResourceManagementService
 */
export interface ResourceState<TFilters, TData, TStatistics = any> {
  filters: TFilters;
  results: TData[];
  totalResults: number;
  loading: boolean;
  error: Error | null;
  statistics?: TStatistics;
  highlights?: any;
}
