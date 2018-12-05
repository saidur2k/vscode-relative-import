'use strict';

import { window, ExtensionContext, commands, workspace, Uri } from 'vscode';

import { fileWatcher } from './helpers/filewatcher'
import { insertTextToActiveDocument } from './helpers/insertTextToActiveDocument';
import { setTargetFile } from './helpers/setTargetFile';
import { getActiveEditorFile } from './helpers/getActiveEditorFile';
import { renderAndInsertFileFromQuickPick } from './helpers/renderAndInsertFileFromQuickPick';
import { addFilesToCache } from './helpers/addFilesToCache';
import { returnImportFilepathString } from './filesystem.utils';
import { getWorkspaceFolder } from './helpers/getWorkspaceFolder';

let watcher;
let workspaceFiles: string[];
let workspacePath: string;


export function activate(context: ExtensionContext) {

    const disposableArray = [];
    let targetFilePath: string
    watcher = workspace.createFileSystemWatcher("**/*.*", false, true, false);
    workspacePath = getWorkspaceFolder();
    fileWatcher(watcher, workspacePath, workspaceFiles, addFilesToCache);
    
    disposableArray.push(commands.registerCommand('relativeImport.copyPath', (uri: Uri) => {
        if(uri && uri.path) {
            targetFilePath = setTargetFile(uri.path)
        } else {
            window.showErrorMessage('Error setting target file path from this context.');
        }
    }));

    disposableArray.push(commands.registerCommand('relativeImport.copyCurrentDocumentPath', () => {
        if(window.activeTextEditor && window.activeTextEditor.document && window.activeTextEditor.document.uri.scheme === 'file' ) {
            targetFilePath = setTargetFile(window.activeTextEditor.document.fileName)
        } else {
            window.showErrorMessage('Error setting target file path from the active editor.');
        }
    }));


    disposableArray.push(commands.registerCommand('relativeImport.pastePath', () => {
        if (!targetFilePath) {
            window.showInformationMessage('Unable to resolve target file.')
        }

        const activeTextEditor = window.activeTextEditor;

        if (!activeTextEditor) {
            window.showErrorMessage('Could not detect Active text Editor.');
            return "";
        }

        const activeTextEditorDocument = getActiveEditorFile();

        if (activeTextEditorDocument) {
            const pathToBeImported = returnImportFilepathString(activeTextEditorDocument, targetFilePath);

            if (pathToBeImported.includes("node_modules")) {
                window.showInformationMessage('Detected node_modules in file path. Is this intended?');
            }

            return insertTextToActiveDocument(activeTextEditor, pathToBeImported);
        }
        
        window.showErrorMessage('Ooops! Unable to resolve path.');
    }));

    disposableArray.push(commands.registerCommand('relativeImport.quickPick', () => {
        renderAndInsertFileFromQuickPick(workspaceFiles, addFilesToCache);
    }));

    context.subscriptions.concat(disposableArray);
}

export function deactivate() {
    watcher = null;
    workspaceFiles = [];
}