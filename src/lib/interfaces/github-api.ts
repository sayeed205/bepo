export interface GitHubRelease {
    url: string;
    assets_url: string;
    upload_url: string;
    html_url: string;
    id: number;
    node_id: string;
    tag_name: string;
    target_commitish: string;
    name: string;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    tarball_url: string;
    zipball_url: string;
    body: string;
}

export interface GithubCommit {
    sha: string;
    node_id: string;
    commit: {
        author: {
            name: string;
            email: string;
            date: string;
        };
        committer: {
            name: string;
            email: string;
            date: string;
        };
        message: string;
        tree: {
            sha: string;
            url: string;
        };
        url: string;
        comment_count: number;
        verification: {
            verified: boolean;
            reason: string;
            signature: string;
            payload: string;
        };
    };
    url: string;
    html_url: string;
    comments_url: string;
    parents: [
        {
            sha: string;
            url: string;
            html_url: string;
        },
    ];
}
