import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import axiosRateLimit from 'axios-rate-limit';
import type NodeCache from 'node-cache';

import type { ExternalAPIOptions } from '@/lib/interfaces';

export class ExternalAPI {
    protected axios: AxiosInstance;
    private baseURL: string;
    private cache?: NodeCache;
    private static readonly DEFAULT_TTL = 300; // 5 minutes default TTL in seconds
    private static readonly DEFAULT_ROLLING_BUFFER = 10000; // 10 seconds rolling buffer in milliseconds

    constructor(
        baseURL: string,
        params: Record<string, unknown>,
        options: ExternalAPIOptions = {},
    ) {
        this.axios = axios.create({
            baseURL,
            params,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...options.headers,
            },
        });

        if (options.rateLimit) {
            this.axios = axiosRateLimit(this.axios, {
                maxRequests: options.rateLimit.maxRequests,
                maxRPS: options.rateLimit.maxRPS,
            });
        }

        this.baseURL = baseURL;
        this.cache = options.nodeCache;
    }

    protected async get<T>(
        endpoint: string,
        config?: AxiosRequestConfig,
        ttl?: number,
    ): Promise<T> {
        const cacheKey = this.serializeCacheKey(endpoint, config?.params);
        const cachedItem = this.cache?.get<T>(cacheKey);
        if (cachedItem) {
            return cachedItem;
        }

        const response = await this.axios.get<T>(endpoint, config);

        if (this.cache) {
            this.cache.set(
                cacheKey,
                response.data,
                ttl ?? ExternalAPI.DEFAULT_TTL,
            );
        }

        return response.data;
    }

    protected async post<T>(
        endpoint: string,
        data: Record<string, unknown>,
        config?: AxiosRequestConfig,
        ttl?: number,
    ): Promise<T> {
        const cacheKey = this.serializeCacheKey(endpoint, {
            config: config?.params,
            data,
        });
        const cachedItem = this.cache?.get<T>(cacheKey);
        if (cachedItem) {
            return cachedItem;
        }

        const response = await this.axios.post<T>(endpoint, data, config);

        if (this.cache) {
            this.cache.set(
                cacheKey,
                response.data,
                ttl ?? ExternalAPI.DEFAULT_TTL,
            );
        }

        return response.data;
    }

    protected async getRolling<T>(
        endpoint: string,
        config?: AxiosRequestConfig,
        ttl?: number,
    ): Promise<T> {
        const cacheKey = this.serializeCacheKey(endpoint, config?.params);
        const cachedItem = this.cache?.get<T>(cacheKey);

        if (cachedItem) {
            const keyTtl = this.cache?.getTtl(cacheKey) ?? 0;

            // If the item has passed our rolling check, fetch again in background
            if (
                keyTtl - (ttl ?? ExternalAPI.DEFAULT_TTL) * 1000 <
                Date.now() - ExternalAPI.DEFAULT_ROLLING_BUFFER
            ) {
                this.axios.get<T>(endpoint, config).then(response => {
                    this.cache?.set(
                        cacheKey,
                        response.data,
                        ttl ?? ExternalAPI.DEFAULT_TTL,
                    );
                });
            }
            return cachedItem;
        }

        const response = await this.axios.get<T>(endpoint, config);

        if (this.cache) {
            this.cache.set(
                cacheKey,
                response.data,
                ttl ?? ExternalAPI.DEFAULT_TTL,
            );
        }

        return response.data;
    }

    private serializeCacheKey(
        endpoint: string,
        params?: Record<string, unknown>,
    ) {
        if (!params) {
            return `${this.baseURL}${endpoint}`;
        }

        return `${this.baseURL}${endpoint}${JSON.stringify(params)}`;
    }
}
