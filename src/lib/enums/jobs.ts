export type JobId =
    | 'plex-recently-added-scan'
    | 'plex-full-scan'
    | 'plex-watchlist-sync'
    | 'radarr-scan'
    | 'sonarr-scan'
    | 'download-sync'
    | 'download-sync-reset'
    | 'jellyfin-recently-added-sync'
    | 'jellyfin-full-sync'
    | 'image-cache-cleanup'
    | 'availability-sync';
