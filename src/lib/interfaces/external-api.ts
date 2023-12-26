import type NodeCache from 'node-cache';

export interface ExternalAPIOptions {
    nodeCache?: NodeCache;
    headers?: Record<string, unknown>;
    rateLimit?: {
        maxRPS: number;
        maxRequests: number;
    };
}
