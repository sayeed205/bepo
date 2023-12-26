export const getCommitTag = async () => {
    const COMMIT_TAG_PATH = '../../commit-tag.json';

    const tagFile = Bun.file(COMMIT_TAG_PATH);

    if (await tagFile.exists()) {
        const data = await tagFile.json();
        return data.commitTag as string;
    }
    return 'local';
};
