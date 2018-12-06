import { window, QuickPickItem } from 'vscode';
import { WorkspaceFileManager } from '../../WorkspaceFileManager';
import { fetchFilesFromWorkspace } from '../fetchFilesFromWorkspace';
import { mapFileToQuickPickItem } from './mapFileToQuickPickItem';

function worker (files: string[], filemanager: WorkspaceFileManager, update: boolean) {
    let emptyItem: QuickPickItem = { label: "", description: "No files found" };

    if (files && files.length > 0) {
        if (update) {
            filemanager.setWorkspaceFiles(files);
        }

        return filemanager.getWorkspaceFiles().map(file => mapFileToQuickPickItem(file));
    } else {
        return [ emptyItem ];
    }
}

export const fetchQuickpickItems = (workspaceFileManager: WorkspaceFileManager): Promise<QuickPickItem[]> => {
    const workspaceFiles = workspaceFileManager.getWorkspaceFiles();

    if (workspaceFiles && workspaceFiles.length > 0) {
        return Promise.resolve(worker(workspaceFiles, workspaceFileManager, false));
    } else {

        window.showInformationMessage('Caching files for quick access, will take a few seconds ☺️');

        return fetchFilesFromWorkspace()
            .then((localWorkspaceFiles: string[]) => {
                window.showInformationMessage('Done caching files ☺️');
                return worker(localWorkspaceFiles, workspaceFileManager, true);
            })
            .catch(err => {
                throw new Error(`Error caching files for quick access. ${err}`);
            });
    }
};