import { version } from '../../package.json';
import { getCommitTag } from './commit-tag';

export const getAppVersion = async () => {
    if (version === '0.1.0') return `develop-${await getCommitTag()}`;
    return version;
};
