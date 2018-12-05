import { window, Uri, FileWatcher } from 'vscode';
import { getWorkspaceFolder } from './getWorkspaceFolder';

export const fileWatcher = (watcher: FileWatcher, workspacePath: string, cachedFiles: string[], addFilesToCache: Function) => {
    // Watch for file system changes - as we're caching the searched files

    // Add a file on creation
    watcher.onDidCreate((e: Uri) => {
        cachedFiles.push(e.fsPath.replace(/\\/g, "/"));
    });

    // on change active text editor refresh the cache
    // if the workspace folder has changed
    window.onDidChangeActiveTextEditor(() => {
        const currentWorkspacePath = getWorkspaceFolder();
        if (workspacePath !== currentWorkspacePath) {
            workspacePath = currentWorkspacePath;

            if (workspacePath) {
                addFilesToCache();
            }
        }
    })

    // Remove a file on deletion
    watcher.onDidDelete((e: Uri) => {
        let item = e.fsPath.replace(/\\/g, "/");
        let index = cachedFiles.indexOf(item);
        if (index > -1) {
            cachedFiles.splice(index, 1);
        }
    });
}