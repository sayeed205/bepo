import type { GitHubRelease, GithubCommit } from '@/lib/interfaces';
import { ExternalAPI, cacheManager, logger } from '@/utils';

export class GithubAPI extends ExternalAPI {
    constructor() {
        super(
            'https://api.github.com',
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                nodeCache: cacheManager.getCache('github').data,
            },
        );
    }

    public async getOverseerrReleases({
        take = 20,
    }: {
        take?: number;
    } = {}): Promise<GitHubRelease[]> {
        try {
            const data = await this.get<GitHubRelease[]>(
                '/repos/fallenbagel/jellyseerr/releases',
                {
                    params: {
                        per_page: take,
                    },
                },
            );

            return data;
        } catch (err) {
            const e = err as unknown as any;
            logger.warn(
                "Failed to retrieve GitHub releases. This may be an issue on GitHub's end. Overseerr can't check if it's on the latest version.",
                { label: 'GitHub API', errorMessage: e.message },
            );
            return [];
        }
    }

    public async getOverseerrCommits({
        take = 20,
        branch = 'develop',
    }: {
        take?: number;
        branch?: string;
    } = {}): Promise<GithubCommit[]> {
        try {
            const data = await this.get<GithubCommit[]>(
                '/repos/fallenbagel/jellyseerr/commits',
                {
                    params: {
                        per_page: take,
                        branch,
                    },
                },
            );

            return data;
        } catch (err) {
            const e = err as unknown as any;
            logger.warn(
                "Failed to retrieve GitHub commits. This may be an issue on GitHub's end. Overseerr can't check if it's on the latest version.",
                { label: 'GitHub API', errorMessage: e.message },
            );
            return [];
        }
    }
}
