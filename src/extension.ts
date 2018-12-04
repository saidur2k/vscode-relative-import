'use strict';

import * as vscode from 'vscode';

import { copyToClipboard } from './utils/clipboard';
import { showInformationMessage, showErrorMessage } from './utils/messaging';
import { resolveFilePathFromURI, getActiveDocumentDirectory, returnImportFilepathString } from './utils/filesystem';
import { insertTextToActiveDocument } from './utils/documentEditor';

const errorMessageHandler = vscode.window.showErrorMessage;
const informationMessageHandler = vscode.window.showInformationMessage;


export function activate(context: vscode.ExtensionContext) {
    const disposableArray = [];

    let targetFilePath = null

    disposableArray.push(vscode.commands.registerCommand('relativeImport.copyPath', (uri) => {
        if(uri && uri.path) {
            targetFilePath = resolveFilePathFromURI(uri.path)
            copyToClipboard(targetFilePath);
            showInformationMessage(informationMessageHandler, `Copied ${targetFilePath} to clipboard for re-use.`)
        } else {
            showErrorMessage(errorMessageHandler, 'No file found');
        }
    }));

    disposableArray.push(vscode.commands.registerCommand('relativeImport.pastePath', () => {
        const activeTextEditor = vscode.window.activeTextEditor;
        const activeTextEditorDocument = activeTextEditor.document;

        if (!targetFilePath) {
            showInformationMessage(informationMessageHandler, 'Unable to resolve target file.')
        }

        if (activeTextEditorDocument.uri.scheme === 'file') {
            const activeFileDirectoryPath = getActiveDocumentDirectory(activeTextEditorDocument.fileName);
            const pathToBeImported = returnImportFilepathString(activeFileDirectoryPath, targetFilePath);

            if (pathToBeImported.includes("node_modules")) {
                showInformationMessage(informationMessageHandler, 'Detected node_modules in file path. Is this intended?')
            }
            insertTextToActiveDocument(vscode.window.activeTextEditor, pathToBeImported);
        } else {
            showErrorMessage(errorMessageHandler, 'Unable to resolve path. Check if the file is in disk.');
        }
    }));

    context.subscriptions.concat(disposableArray);
}

export function deactivate() {
}