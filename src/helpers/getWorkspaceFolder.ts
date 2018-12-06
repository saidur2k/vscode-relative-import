import { window, workspace } from 'vscode';
import { sanitizePath } from '../filesystem.utils';

export const getWorkspaceFolder = () => {
    const editor = window.activeTextEditor;
    if (editor) {
        const res = editor.document.uri;
        const folder = workspace.getWorkspaceFolder(res);
        if (folder) {
            return sanitizePath(folder.uri.fsPath);
        } else {
            throw new Error('Error getting workspace path.');
        }
    } else {
        throw new Error('Could not access Editor context.');
    }
};