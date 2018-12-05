import { window, workspace } from 'vscode';

export const getWorkspaceFolder = () => {
    const editor = window.activeTextEditor;
    if (editor) {
        const res = editor.document.uri;
        const folder = workspace.getWorkspaceFolder(res);
        if (folder) {
            return folder.uri.fsPath.replace(/\\/g, "/");
        } else {
            window.showErrorMessage('Error getting workspace path');
            return ""
        }
    }
}