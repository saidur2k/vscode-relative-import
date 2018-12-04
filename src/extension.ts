'use strict';

import { window, ExtensionContext, commands, TextEditor } from 'vscode';
import { resolveFilePathFromURI, returnImportFilepathString } from './filesystem.utils';

const copypaste = require("copy-paste");
const copyToClipboard = (stringToCopy: string) => {
    return copypaste.copy(stringToCopy);
}

const setStatusBarMessage = (message: string) => {
    return window.setStatusBarMessage(message, 10)
}

const showInformationMessage = (message: string) => {
    return window.showInformationMessage(message);
}

const showErrorMessage = (message: string) => {
    return window.showErrorMessage(message);
}

const insertTextToActiveDocument = (activeDocumentTextEditor: TextEditor, textToInsert: string) => {
    activeDocumentTextEditor.edit(
        edit => activeDocumentTextEditor.selections.forEach(
            selection => {
                edit.delete(selection)
                edit.insert(selection.start, textToInsert.toString())
            }
        )
    )
}

export function activate(context: ExtensionContext) {
    const disposableArray = [];

    let targetFilePath: string = ''

    disposableArray.push(commands.registerCommand('relativeImport.copyPath', (uri) => {
        if(uri && uri.path) {
            targetFilePath = resolveFilePathFromURI(uri.path)
            copyToClipboard(targetFilePath);
            showInformationMessage(`Copied ${targetFilePath} to clipboard for re-use.`)
            setStatusBarMessage(`Copied ${targetFilePath} to clipboard for re-use.`)
        } else {
            showErrorMessage('No file found');
        }
    }));

    disposableArray.push(commands.registerCommand('relativeImport.pastePath', () => {
        if (!targetFilePath) {
            showInformationMessage('Unable to resolve target file.')
        }

        const activeTextEditor = window.activeTextEditor;

        if (!activeTextEditor) {
            throw new Error('Could not detect Active text Editor')
        }

        const activeTextEditorDocument = activeTextEditor.document;


        if (!(activeTextEditorDocument.uri && activeTextEditorDocument.uri.scheme)) {
            throw new Error('Could not detect active text editor file')
        }

        if (activeTextEditorDocument.uri.scheme !== 'file') {
            showErrorMessage('Unable to resolve path. Check if the file is in disk.');
        }

        if (activeTextEditorDocument.uri.scheme === 'file') {
            const pathToBeImported = returnImportFilepathString(activeTextEditorDocument.fileName, targetFilePath);

            if (pathToBeImported.includes("node_modules")) {
                showInformationMessage('Detected node_modules in file path. Is this intended?')
            }
            return insertTextToActiveDocument(activeTextEditor, pathToBeImported);
        } 
        
        
        showErrorMessage('Ooops! Unable to resolve path.');
    }));

    context.subscriptions.concat(disposableArray);
}

export function deactivate() {
}