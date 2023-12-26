import { GithubAPI, getAppVersion, getCommitTag, restartFlag } from '@/utils';

export const checkAppStatus = async () => {
    const currentVersion = await getAppVersion();
    const commitTag = await getCommitTag();
    let updateAvailable = false;
    let commitsBehind = 0;

    const githubApi = new GithubAPI();

    if (currentVersion.startsWith('develop-') && commitTag !== 'local') {
        const commits = await githubApi.getOverseerrCommits();

        if (commits.length) {
            const filteredCommits = commits.filter(
                commit => !commit.commit.message.includes('[skip ci]'),
            );
            if (filteredCommits[0].sha !== commitTag) {
                updateAvailable = true;
            }

            const commitIndex = filteredCommits.findIndex(
                commit => commit.sha === commitTag,
            );

            if (updateAvailable) {
                commitsBehind = commitIndex;
            }
        }
    } else if (commitTag !== 'local') {
        const releases = await githubApi.getOverseerrReleases();

        if (releases.length) {
            const latestVersion = releases[0];

            if (!latestVersion.name.includes(currentVersion)) {
                updateAvailable = true;
            }
        }
    }

    return {
        version: await getAppVersion(),
        commitTag: await getCommitTag(),
        updateAvailable,
        commitsBehind,
        restartRequired: restartFlag.isSet(),
    };
};
