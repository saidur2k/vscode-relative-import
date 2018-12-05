import * as fs from 'fs';
import * as glob from 'glob';
import { loadGitignoreRules } from '../gitignore.utils'
import { getWorkspaceFolder } from './getWorkspaceFolder';
const { promisify } = require('util');

export const addFilesToCache = async(): Promise<any> => {
    const workspacePath = getWorkspaceFolder();

    let ignorePaths: string[] = []

    // if .gitignore exists
    const gitIgnoreFileExists = fs.readFileSync(`${workspacePath}/.gitignore`)
    if (gitIgnoreFileExists) {
        gitIgnoreFileExists.toString().split('\n').map(row => ignorePaths.push(row))
        ignorePaths = loadGitignoreRules(`${workspacePath}/.gitignore`)
    }
    
    const globAsync = promisify(glob); 

    // Search for files
    return globAsync(`${workspacePath}/**/*.*`, {
        ignore: [
            ...ignorePaths
        ]
    })
};