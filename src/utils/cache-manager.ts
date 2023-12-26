import NodeCache from 'node-cache';

export type AvailableCacheIds =
    | 'tmdb'
    | 'radarr'
    | 'sonarr'
    | 'rt'
    | 'imdb'
    | 'github'
    | 'plexguid'
    | 'plextv';

class Cache {
    public id: AvailableCacheIds;
    public data: NodeCache;
    public name: string;
    private static readonly DEFAULT_TTL = 300; // 5 minutes default TTL in seconds
    private static readonly DEFAULT_CHECK_PERIOD = 10000; // 10 seconds rolling buffer in milliseconds

    constructor(
        id: AvailableCacheIds,
        name: string,
        options: { stdTtl?: number; checkPeriod?: number } = {},
    ) {
        this.id = id;
        this.name = name;
        this.data = new NodeCache({
            stdTTL: options.stdTtl ?? Cache.DEFAULT_TTL,
            checkperiod: options.checkPeriod ?? Cache.DEFAULT_CHECK_PERIOD,
        });
    }

    public getStats() {
        return this.data.getStats();
    }

    public flush(): void {
        this.data.flushAll();
    }
}

class CacheManager {
    private availableCaches: Record<AvailableCacheIds, Cache> = {
        tmdb: new Cache('tmdb', 'The Movie Database API', {
            stdTtl: 21600,
            checkPeriod: 60 * 30,
        }),
        radarr: new Cache('radarr', 'Radarr API'),
        sonarr: new Cache('sonarr', 'Sonarr API'),
        rt: new Cache('rt', 'Rotten Tomatoes API', {
            stdTtl: 43200,
            checkPeriod: 60 * 30,
        }),
        imdb: new Cache('imdb', 'IMDB Radarr Proxy', {
            stdTtl: 43200,
            checkPeriod: 60 * 30,
        }),
        github: new Cache('github', 'GitHub API', {
            stdTtl: 21600,
            checkPeriod: 60 * 30,
        }),
        plexguid: new Cache('plexguid', 'Plex GUID', {
            stdTtl: 86400 * 7, // 1 week cache
            checkPeriod: 60 * 30,
        }),
        plextv: new Cache('plextv', 'Plex TV', {
            stdTtl: 86400 * 7, // 1 week cache
            checkPeriod: 60,
        }),
    };

    public getCache(id: AvailableCacheIds): Cache {
        return this.availableCaches[id];
    }

    public getAllCaches(): Record<string, Cache> {
        return this.availableCaches;
    }
}

export const cacheManager = new CacheManager();
