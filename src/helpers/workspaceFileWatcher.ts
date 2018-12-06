import { window, Uri, FileSystemWatcher } from 'vscode';
import { IWorkspaceFileManager } from '../WorkspaceFileManager';
import { RelativeImport } from '../RelativeImport';
import { getWorkspaceFolder } from './getWorkspaceFolder';

export const workspaceFileWatcher = (
        watcher: FileSystemWatcher,
        relativeImport: RelativeImport,
        addFilesToCache: Function,
        workspaceFileManager: IWorkspaceFileManager,
    ) => {
    // Watch for file system changes - as we're caching the searched files
    // Add a file on creation
    watcher.onDidCreate((e: Uri) => {
        workspaceFileManager.addFileToWorkspace(e.fsPath.replace(/\\/g, "/"));
    });

    // on change active text editor refresh the cache
    // if the workspace folder has changed
    window.onDidChangeActiveTextEditor(() => {
        const currentWorkspacePath = getWorkspaceFolder();

        if (relativeImport.currentWorkspacePath !== currentWorkspacePath) {
            relativeImport.currentWorkspacePath = currentWorkspacePath;
            workspaceFileManager.setWorkspaceFiles(addFilesToCache());
        }
    });

    // Remove a file on deletion
    watcher.onDidDelete((e: Uri) => {
        let item = e.fsPath.replace(/\\/g, "/");
        workspaceFileManager.removeWorkspaceFile(item);
    });
};