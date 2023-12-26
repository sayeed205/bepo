import type { JobId } from '@/lib/enums';

interface Quota {
    quotaLimit?: number;
    quotaDays?: number;
}

export interface MainSettings {
    apiKey: string;
    applicationTitle: string;
    applicationUrl: string;
    csrfProtection: boolean;
    cacheImages: boolean;
    defaultPermissions: number;
    defaultQuotas: {
        movie: Quota;
        tv: Quota;
    };
    hideAvailable: boolean;
    localLogin: boolean;
    newPlexLogin: boolean;
    region: string;
    originalLanguage: string;
    trustProxy: boolean;
    mediaServerType: number;
    partialRequestsEnabled: boolean;
    locale: string;
}

export interface Library {
    id: string;
    name: string;
    enabled: boolean;
    type: 'show' | 'movie';
    lastScan?: number;
}

export interface PlexSettings {
    name: string;
    machineId?: string;
    ip: string;
    port: number;
    useSsl?: boolean;
    libraries: Library[];
    webAppUrl?: string;
}

export interface JellyfinSettings {
    name: string;
    hostname: string;
    externalHostname?: string;
    libraries: Library[];
    serverId: string;
}
export interface TautulliSettings {
    hostname?: string;
    port?: number;
    useSsl?: boolean;
    urlBase?: string;
    apiKey?: string;
    externalUrl?: string;
}

export interface DVRSettings {
    id: number;
    name: string;
    hostname: string;
    port: number;
    apiKey: string;
    useSsl: boolean;
    baseUrl?: string;
    activeProfileId: number;
    activeProfileName: string;
    activeDirectory: string;
    tags: number[];
    is4k: boolean;
    isDefault: boolean;
    externalUrl?: string;
    syncEnabled: boolean;
    preventSearch: boolean;
    tagRequests: boolean;
}

export interface RadarrSettings extends DVRSettings {
    minimumAvailability: string;
}

export interface SonarrSettings extends DVRSettings {
    activeAnimeProfileId?: number;
    activeAnimeProfileName?: string;
    activeAnimeDirectory?: string;
    activeAnimeLanguageProfileId?: number;
    activeLanguageProfileId?: number;
    animeTags?: number[];
    enableSeasonFolders: boolean;
}

export interface PublicSettings {
    initialized: boolean;
}

export interface FullPublicSettings extends PublicSettings {
    applicationTitle: string;
    applicationUrl: string;
    hideAvailable: boolean;
    localLogin: boolean;
    movie4kEnabled: boolean;
    series4kEnabled: boolean;
    region: string;
    originalLanguage: string;
    mediaServerType: number;
    jellyfinHost?: string;
    jellyfinServerName?: string;
    partialRequestsEnabled: boolean;
    cacheImages: boolean;
    vapidPublic: string;
    enablePushRegistration: boolean;
    locale: string;
    emailEnabled: boolean;
    userEmailRequired: boolean;
    newPlexLogin: boolean;
}

export interface NotificationAgentPushover extends NotificationAgentConfig {
    options: {
        accessToken: string;
        userToken: string;
    };
}

export interface NotificationAgentWebhook extends NotificationAgentConfig {
    options: {
        webhookUrl: string;
        jsonPayload: string;
        authHeader?: string;
    };
}

export interface NotificationAgentGotify extends NotificationAgentConfig {
    options: {
        url: string;
        token: string;
    };
}

export interface NotificationAgentConfig {
    enabled: boolean;
    types?: number;
    options: Record<string, unknown>;
}
export interface NotificationAgentDiscord extends NotificationAgentConfig {
    options: {
        botUsername?: string;
        botAvatarUrl?: string;
        webhookUrl: string;
        enableMentions: boolean;
    };
}

export interface NotificationAgentSlack extends NotificationAgentConfig {
    options: {
        webhookUrl: string;
    };
}

export interface NotificationAgentEmail extends NotificationAgentConfig {
    options: {
        userEmailRequired: boolean;
        emailFrom: string;
        smtpHost: string;
        smtpPort: number;
        secure: boolean;
        ignoreTls: boolean;
        requireTls: boolean;
        authUser?: string;
        authPass?: string;
        allowSelfSigned: boolean;
        senderName: string;
        pgpPrivateKey?: string;
        pgpPassword?: string;
    };
}

export interface NotificationAgentLunaSea extends NotificationAgentConfig {
    options: {
        webhookUrl: string;
        profileName?: string;
    };
}

export interface NotificationAgentTelegram extends NotificationAgentConfig {
    options: {
        botUsername?: string;
        botAPI: string;
        chatId: string;
        sendSilently: boolean;
    };
}

export interface NotificationAgentPushbullet extends NotificationAgentConfig {
    options: {
        accessToken: string;
        channelTag?: string;
    };
}

export interface NotificationAgentPushover extends NotificationAgentConfig {
    options: {
        accessToken: string;
        userToken: string;
    };
}

export interface NotificationAgentWebhook extends NotificationAgentConfig {
    options: {
        webhookUrl: string;
        jsonPayload: string;
        authHeader?: string;
    };
}

export interface NotificationAgentGotify extends NotificationAgentConfig {
    options: {
        url: string;
        token: string;
    };
}

interface NotificationAgents {
    discord: NotificationAgentDiscord;
    email: NotificationAgentEmail;
    gotify: NotificationAgentGotify;
    lunasea: NotificationAgentLunaSea;
    pushbullet: NotificationAgentPushbullet;
    pushover: NotificationAgentPushover;
    slack: NotificationAgentSlack;
    telegram: NotificationAgentTelegram;
    webhook: NotificationAgentWebhook;
    webpush: NotificationAgentConfig;
}

export interface NotificationSettings {
    agents: NotificationAgents;
}

export interface JobSettings {
    schedule: string;
}

export interface AllSettings {
    clientId: string;
    vapidPublic: string;
    vapidPrivate: string;
    main: MainSettings;
    plex: PlexSettings;
    jellyfin: JellyfinSettings;
    tautulli: TautulliSettings;
    radarr: RadarrSettings[];
    sonarr: SonarrSettings[];
    public: PublicSettings;
    notifications: NotificationSettings;
    jobs: Record<JobId, JobSettings>;
}
