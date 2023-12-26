import { randomUUID } from 'crypto';
import fs from 'fs';
import { merge } from 'lodash';
import path from 'path';
import webpush from 'web-push';

import { type JobId, MediaServerType, Permission } from '@/lib/enums';
import type {
    AllSettings,
    FullPublicSettings,
    JellyfinSettings,
    JobSettings,
    MainSettings,
    NotificationSettings,
    PlexSettings,
    PublicSettings,
    RadarrSettings,
    SonarrSettings,
    TautulliSettings,
} from '@/lib/interfaces';

const SETTINGS_PATH = process.env.CONFIG_DIRECTORY
    ? `${process.env.CONFIG_DIRECTORY}/settings.json`
    : path.join(import.meta.dir, '../config/settings.json');

export class Settings {
    private data: AllSettings;

    constructor(initialSettings?: AllSettings) {
        this.data = {
            clientId: randomUUID(),
            vapidPrivate: '',
            vapidPublic: '',
            main: {
                apiKey: '',
                applicationTitle: 'Jellyseerr',
                applicationUrl: '',
                csrfProtection: false,
                cacheImages: false,
                defaultPermissions: Permission.REQUEST,
                defaultQuotas: {
                    movie: {},
                    tv: {},
                },
                hideAvailable: false,
                localLogin: true,
                newPlexLogin: true,
                region: '',
                originalLanguage: '',
                trustProxy: false,
                mediaServerType: MediaServerType.NOT_CONFIGURED,
                partialRequestsEnabled: true,
                locale: 'en',
            },
            plex: {
                name: '',
                ip: '',
                port: 32400,
                useSsl: false,
                libraries: [],
            },
            jellyfin: {
                name: '',
                hostname: '',
                externalHostname: '',
                libraries: [],
                serverId: '',
            },
            tautulli: {},
            radarr: [],
            sonarr: [],
            public: {
                initialized: false,
            },
            notifications: {
                agents: {
                    email: {
                        enabled: false,
                        options: {
                            userEmailRequired: false,
                            emailFrom: '',
                            smtpHost: '',
                            smtpPort: 587,
                            secure: false,
                            ignoreTls: false,
                            requireTls: false,
                            allowSelfSigned: false,
                            senderName: 'Jellyseerr',
                        },
                    },
                    discord: {
                        enabled: false,
                        types: 0,
                        options: {
                            webhookUrl: '',
                            enableMentions: true,
                        },
                    },
                    lunasea: {
                        enabled: false,
                        types: 0,
                        options: {
                            webhookUrl: '',
                        },
                    },
                    slack: {
                        enabled: false,
                        types: 0,
                        options: {
                            webhookUrl: '',
                        },
                    },
                    telegram: {
                        enabled: false,
                        types: 0,
                        options: {
                            botAPI: '',
                            chatId: '',
                            sendSilently: false,
                        },
                    },
                    pushbullet: {
                        enabled: false,
                        types: 0,
                        options: {
                            accessToken: '',
                        },
                    },
                    pushover: {
                        enabled: false,
                        types: 0,
                        options: {
                            accessToken: '',
                            userToken: '',
                        },
                    },
                    webhook: {
                        enabled: false,
                        types: 0,
                        options: {
                            webhookUrl: '',
                            jsonPayload:
                                'IntcbiAgXCJub3RpZmljYXRpb25fdHlwZVwiOiBcInt7bm90aWZpY2F0aW9uX3R5cGV9fVwiLFxuICBcImV2ZW50XCI6IFwie3tldmVudH19XCIsXG4gIFwic3ViamVjdFwiOiBcInt7c3ViamVjdH19XCIsXG4gIFwibWVzc2FnZVwiOiBcInt7bWVzc2FnZX19XCIsXG4gIFwiaW1hZ2VcIjogXCJ7e2ltYWdlfX1cIixcbiAgXCJ7e21lZGlhfX1cIjoge1xuICAgIFwibWVkaWFfdHlwZVwiOiBcInt7bWVkaWFfdHlwZX19XCIsXG4gICAgXCJ0bWRiSWRcIjogXCJ7e21lZGlhX3RtZGJpZH19XCIsXG4gICAgXCJ0dmRiSWRcIjogXCJ7e21lZGlhX3R2ZGJpZH19XCIsXG4gICAgXCJzdGF0dXNcIjogXCJ7e21lZGlhX3N0YXR1c319XCIsXG4gICAgXCJzdGF0dXM0a1wiOiBcInt7bWVkaWFfc3RhdHVzNGt9fVwiXG4gIH0sXG4gIFwie3tyZXF1ZXN0fX1cIjoge1xuICAgIFwicmVxdWVzdF9pZFwiOiBcInt7cmVxdWVzdF9pZH19XCIsXG4gICAgXCJyZXF1ZXN0ZWRCeV9lbWFpbFwiOiBcInt7cmVxdWVzdGVkQnlfZW1haWx9fVwiLFxuICAgIFwicmVxdWVzdGVkQnlfdXNlcm5hbWVcIjogXCJ7e3JlcXVlc3RlZEJ5X3VzZXJuYW1lfX1cIixcbiAgICBcInJlcXVlc3RlZEJ5X2F2YXRhclwiOiBcInt7cmVxdWVzdGVkQnlfYXZhdGFyfX1cIixcbiAgICBcInJlcXVlc3RlZEJ5X3NldHRpbmdzX2Rpc2NvcmRJZFwiOiBcInt7cmVxdWVzdGVkQnlfc2V0dGluZ3NfZGlzY29yZElkfX1cIixcbiAgICBcInJlcXVlc3RlZEJ5X3NldHRpbmdzX3RlbGVncmFtQ2hhdElkXCI6IFwie3tyZXF1ZXN0ZWRCeV9zZXR0aW5nc190ZWxlZ3JhbUNoYXRJZH19XCJcbiAgfSxcbiAgXCJ7e2lzc3VlfX1cIjoge1xuICAgIFwiaXNzdWVfaWRcIjogXCJ7e2lzc3VlX2lkfX1cIixcbiAgICBcImlzc3VlX3R5cGVcIjogXCJ7e2lzc3VlX3R5cGV9fVwiLFxuICAgIFwiaXNzdWVfc3RhdHVzXCI6IFwie3tpc3N1ZV9zdGF0dXN9fVwiLFxuICAgIFwicmVwb3J0ZWRCeV9lbWFpbFwiOiBcInt7cmVwb3J0ZWRCeV9lbWFpbH19XCIsXG4gICAgXCJyZXBvcnRlZEJ5X3VzZXJuYW1lXCI6IFwie3tyZXBvcnRlZEJ5X3VzZXJuYW1lfX1cIixcbiAgICBcInJlcG9ydGVkQnlfYXZhdGFyXCI6IFwie3tyZXBvcnRlZEJ5X2F2YXRhcn19XCIsXG4gICAgXCJyZXBvcnRlZEJ5X3NldHRpbmdzX2Rpc2NvcmRJZFwiOiBcInt7cmVwb3J0ZWRCeV9zZXR0aW5nc19kaXNjb3JkSWR9fVwiLFxuICAgIFwicmVwb3J0ZWRCeV9zZXR0aW5nc190ZWxlZ3JhbUNoYXRJZFwiOiBcInt7cmVwb3J0ZWRCeV9zZXR0aW5nc190ZWxlZ3JhbUNoYXRJZH19XCJcbiAgfSxcbiAgXCJ7e2NvbW1lbnR9fVwiOiB7XG4gICAgXCJjb21tZW50X21lc3NhZ2VcIjogXCJ7e2NvbW1lbnRfbWVzc2FnZX19XCIsXG4gICAgXCJjb21tZW50ZWRCeV9lbWFpbFwiOiBcInt7Y29tbWVudGVkQnlfZW1haWx9fVwiLFxuICAgIFwiY29tbWVudGVkQnlfdXNlcm5hbWVcIjogXCJ7e2NvbW1lbnRlZEJ5X3VzZXJuYW1lfX1cIixcbiAgICBcImNvbW1lbnRlZEJ5X2F2YXRhclwiOiBcInt7Y29tbWVudGVkQnlfYXZhdGFyfX1cIixcbiAgICBcImNvbW1lbnRlZEJ5X3NldHRpbmdzX2Rpc2NvcmRJZFwiOiBcInt7Y29tbWVudGVkQnlfc2V0dGluZ3NfZGlzY29yZElkfX1cIixcbiAgICBcImNvbW1lbnRlZEJ5X3NldHRpbmdzX3RlbGVncmFtQ2hhdElkXCI6IFwie3tjb21tZW50ZWRCeV9zZXR0aW5nc190ZWxlZ3JhbUNoYXRJZH19XCJcbiAgfSxcbiAgXCJ7e2V4dHJhfX1cIjogW11cbn0i',
                        },
                    },
                    webpush: {
                        enabled: false,
                        options: {},
                    },
                    gotify: {
                        enabled: false,
                        types: 0,
                        options: {
                            url: '',
                            token: '',
                        },
                    },
                },
            },
            jobs: {
                'plex-recently-added-scan': {
                    schedule: '0 */5 * * * *',
                },
                'plex-full-scan': {
                    schedule: '0 0 3 * * *',
                },
                'plex-watchlist-sync': {
                    schedule: '0 */10 * * * *',
                },
                'radarr-scan': {
                    schedule: '0 0 4 * * *',
                },
                'sonarr-scan': {
                    schedule: '0 30 4 * * *',
                },
                'availability-sync': {
                    schedule: '0 0 5 * * *',
                },
                'download-sync': {
                    schedule: '0 * * * * *',
                },
                'download-sync-reset': {
                    schedule: '0 0 1 * * *',
                },
                'jellyfin-recently-added-sync': {
                    schedule: '0 */5 * * * *',
                },
                'jellyfin-full-sync': {
                    schedule: '0 0 3 * * *',
                },
                'image-cache-cleanup': {
                    schedule: '0 0 5 * * *',
                },
            },
        };
        if (initialSettings) {
            this.data = merge(this.data, initialSettings);
        }
    }

    get main(): MainSettings {
        if (!this.data.main.apiKey) {
            this.data.main.apiKey = this.generateApiKey();
            this.save();
        }
        return this.data.main;
    }

    set main(data: MainSettings) {
        this.data.main = data;
    }

    get plex(): PlexSettings {
        return this.data.plex;
    }

    set plex(data: PlexSettings) {
        this.data.plex = data;
    }

    get jellyfin(): JellyfinSettings {
        return this.data.jellyfin;
    }

    set jellyfin(data: JellyfinSettings) {
        this.data.jellyfin = data;
    }

    get tautulli(): TautulliSettings {
        return this.data.tautulli;
    }

    set tautulli(data: TautulliSettings) {
        this.data.tautulli = data;
    }

    get radarr(): RadarrSettings[] {
        return this.data.radarr;
    }

    set radarr(data: RadarrSettings[]) {
        this.data.radarr = data;
    }

    get sonarr(): SonarrSettings[] {
        return this.data.sonarr;
    }

    set sonarr(data: SonarrSettings[]) {
        this.data.sonarr = data;
    }

    get public(): PublicSettings {
        return this.data.public;
    }

    set public(data: PublicSettings) {
        this.data.public = data;
    }

    get fullPublicSettings(): FullPublicSettings {
        return {
            ...this.data.public,
            applicationTitle: this.data.main.applicationTitle,
            applicationUrl: this.data.main.applicationUrl,
            hideAvailable: this.data.main.hideAvailable,
            localLogin: this.data.main.localLogin,
            movie4kEnabled: this.data.radarr.some(
                radarr => radarr.is4k && radarr.isDefault,
            ),
            series4kEnabled: this.data.sonarr.some(
                sonarr => sonarr.is4k && sonarr.isDefault,
            ),
            region: this.data.main.region,
            originalLanguage: this.data.main.originalLanguage,
            mediaServerType: this.main.mediaServerType,
            jellyfinHost: this.jellyfin.hostname,
            partialRequestsEnabled: this.data.main.partialRequestsEnabled,
            cacheImages: this.data.main.cacheImages,
            vapidPublic: this.vapidPublic,
            enablePushRegistration:
                this.data.notifications.agents.webpush.enabled,
            locale: this.data.main.locale,
            emailEnabled: this.data.notifications.agents.email.enabled,
            userEmailRequired:
                this.data.notifications.agents.email.options.userEmailRequired,
            newPlexLogin: this.data.main.newPlexLogin,
        };
    }

    get notifications(): NotificationSettings {
        return this.data.notifications;
    }

    set notifications(data: NotificationSettings) {
        this.data.notifications = data;
    }

    get jobs(): Record<JobId, JobSettings> {
        return this.data.jobs;
    }

    set jobs(data: Record<JobId, JobSettings>) {
        this.data.jobs = data;
    }

    get clientId(): string {
        if (!this.data.clientId) {
            this.data.clientId = randomUUID();
            this.save();
        }

        return this.data.clientId;
    }

    get vapidPublic(): string {
        this.generateVapidKeys();

        return this.data.vapidPublic;
    }

    get vapidPrivate(): string {
        this.generateVapidKeys();

        return this.data.vapidPrivate;
    }

    public regenerateApiKey(): MainSettings {
        this.main.apiKey = this.generateApiKey();
        this.save();
        return this.main;
    }

    private generateApiKey(): string {
        return Buffer.from(`${Date.now()}${randomUUID()}`).toString('base64');
    }

    private generateVapidKeys(force = false): void {
        if (!this.data.vapidPublic || !this.data.vapidPrivate || force) {
            const vapidKeys = webpush.generateVAPIDKeys();
            this.data.vapidPrivate = vapidKeys.privateKey;
            this.data.vapidPublic = vapidKeys.publicKey;
            this.save();
        }
    }

    /**
     * Settings Load
     *
     * This will load settings from file unless an optional argument of the object structure
     * is passed in.
     * @param overrideSettings If passed in, will override all existing settings with these
     * values
     */
    public load(overrideSettings?: AllSettings): Settings {
        if (overrideSettings) {
            this.data = overrideSettings;
            return this;
        }

        if (!fs.existsSync(SETTINGS_PATH)) {
            this.save();
        }
        const data = fs.readFileSync(SETTINGS_PATH, 'utf-8');

        if (data) {
            this.data = merge(this.data, JSON.parse(data));
            this.save();
        }
        return this;
    }

    public save(): void {
        fs.writeFileSync(
            SETTINGS_PATH,
            JSON.stringify(this.data, undefined, ' '),
        );
    }
}
