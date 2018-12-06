import * as glob from 'glob';
import { gitIgnoreRules } from '../gitignore.utils';
const { promisify } = require('util');
import { getWorkspaceFolder } from './getWorkspaceFolder';

export const fetchFilesFromWorkspace = (): Promise<string[]> => {
    const currentWorkspacePath = getWorkspaceFolder();
    const globAsync = promisify(glob);
    return globAsync(`${currentWorkspacePath}/**/*.*`, {
        ignore: [
            ...gitIgnoreRules(`${currentWorkspacePath}/.gitignore`)
        ]
    });
};