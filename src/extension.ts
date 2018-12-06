import { window, ExtensionContext, commands, workspace, Uri, FileSystemWatcher } from 'vscode';
import { WorkspaceFileManager } from './WorkspaceFileManager';

import { workspaceFileWatcher } from './helpers/workspaceFileWatcher';
import { insertTextToActiveDocument } from './helpers/insertTextToActiveDocument';
import { renderAndInsertFileFromQuickPick } from './helpers/Quickpick/renderAndInsertFileFromQuickPick';
import { fetchFilesFromWorkspace } from './helpers/fetchFilesFromWorkspace';
import { RelativeImport } from './RelativeImport';

let watcher: FileSystemWatcher;
let workspaceFileManager: WorkspaceFileManager;
let relativeImport: RelativeImport;

export function activate(context: ExtensionContext) {
    workspaceFileManager = new WorkspaceFileManager();
    relativeImport = new RelativeImport();
    const disposableArray = [];

    watcher = workspace.createFileSystemWatcher("**/*.*", false, true, false);

    workspaceFileWatcher(watcher, relativeImport, fetchFilesFromWorkspace, workspaceFileManager);

    disposableArray.push(commands.registerCommand('relativeImport.copyPath', (uri: Uri) => {
        if(uri && uri.path) {
            relativeImport.targetFile = uri.path;
        } else {
            window.showErrorMessage('Error setting target file path from this context.');
        }
    }));

    disposableArray.push(commands.registerCommand('relativeImport.copyCurrentDocumentPath', () => {
        if(window.activeTextEditor && window.activeTextEditor.document && window.activeTextEditor.document.uri.scheme === 'file' ) {
            relativeImport.targetFile = window.activeTextEditor.document.fileName;
        } else {
            window.showErrorMessage('Error setting target file path from the active editor.');
        }
    }));


    disposableArray.push(commands.registerCommand('relativeImport.pastePath', () => {
        if (!relativeImport.targetFile) {
            window.showInformationMessage('Unable to resolve target file.');
        }

        const activeTextEditor = window.activeTextEditor;

        if (!activeTextEditor) {
            window.showErrorMessage('Could not detect Active text Editor.');
            return "";
        }

        return insertTextToActiveDocument(relativeImport.getRelativePath());
    }));

    disposableArray.push(commands.registerCommand('relativeImport.quickPick', () => {
        renderAndInsertFileFromQuickPick(workspaceFileManager, relativeImport);
    }));

    context.subscriptions.concat(disposableArray);
}

export function deactivate() {
    watcher.dispose();
    workspaceFileManager.dispose();
    relativeImport.dispose();
}