'use strict';

import { window, ExtensionContext, commands, TextEditor, QuickPickItem, workspace } from 'vscode';
import * as glob from 'glob';
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

const setTargetFile = (input: string) => {
    if(input) {
        const targetFilePath = resolveFilePathFromURI(input)
        copyToClipboard(targetFilePath);
        showInformationMessage(`Copied ${targetFilePath} to clipboard for re-use.`)
        setStatusBarMessage(`Copied ${targetFilePath} to clipboard for re-use.`)
        return targetFilePath
    } else {
        showErrorMessage('Error setting target file path.');
        return ""
    }
}

function getWorkspaceFolder() {
    const editor = window.activeTextEditor;
    if (editor) {
        const res = editor.document.uri;
        const folder = workspace.getWorkspaceFolder(res);
        if (folder) {
            return folder.uri.fsPath.replace(/\\/g, "/");
        } else {
            showErrorMessage('Error getting workspace path');
        }
    }
}


const getActiveEditorFile = () => {
    const activeTextEditor = window.activeTextEditor;

    if (!activeTextEditor) {
        showErrorMessage('Could not detect Active text Editor.');
        return "";
    }

    const activeTextEditorDocument = activeTextEditor.document;

    if (!(activeTextEditorDocument.uri && activeTextEditorDocument.uri.scheme)) {
        showErrorMessage('Could not detect active text editor file.');
        return "";
    }

    if (activeTextEditorDocument.uri.scheme === 'file') {
        return activeTextEditorDocument.fileName;
    } else {
        showErrorMessage('Unable to resolve path. Check if the file is in disk.');
        return "";
    }
}


function workspaceFiles(): void {
    const workspacePath = getWorkspaceFolder();

    // Search for files
    return glob(`${workspacePath}/**/*.*`, {
        ignore: [
            `${workspacePath}/node_modules/**/*.*`
        ]
    }, function (err: Error | null, items: string[]) {

        if (err) {
            showErrorMessage(err.message);
        }

        let paths: QuickPickItem[];

        if (items.length > 0) {
            paths = items.map((val: string) => {
                let item: QuickPickItem = { description: val, label: "" + val.split("/").pop() };
                return item;
            });
        } else {
            let emptyItem: QuickPickItem = { label: "", description: "No files found" };
            paths = [emptyItem]
        }

        const activeTextEditor = window.activeTextEditor;

        if (!activeTextEditor) {
            throw new Error('Could not detect Active text Editor.')
        }

        let pickResult: Thenable<QuickPickItem | undefined>;
        pickResult = window.showQuickPick(paths, { matchOnDescription: true, placeHolder: `Type to filter ${items.length} files` });
        pickResult.then((item: QuickPickItem | undefined) => {
            const activeTextEditorDocument = getActiveEditorFile();

            if (activeTextEditorDocument && item && item.description) {
                const pathToBeImported = returnImportFilepathString(activeTextEditorDocument, item.description);
                return insertTextToActiveDocument(activeTextEditor, pathToBeImported);
            } else {
                showErrorMessage('Could not set path from quick pick.');
            }

        });
      })
}

export function activate(context: ExtensionContext) {
    const disposableArray = [];

    let targetFilePath: string

    disposableArray.push(commands.registerCommand('relativeImport.copyPath', (uri) => {
        if(uri && uri.path) {
            targetFilePath = setTargetFile(uri.path)
        } else {
            showErrorMessage('Error setting target file path from this context.');
        }
    }));

    disposableArray.push(commands.registerCommand('relativeImport.copyCurrentDocumentPath', () => {
        if(window.activeTextEditor && window.activeTextEditor.document && window.activeTextEditor.document.uri.scheme === 'file' ) {
            targetFilePath = setTargetFile(window.activeTextEditor.document.fileName)
        } else {
            showErrorMessage('Error setting target file path from the active editor.');
        }
    }));


    disposableArray.push(commands.registerCommand('relativeImport.pastePath', () => {
        if (!targetFilePath) {
            showInformationMessage('Unable to resolve target file.')
        }

        const activeTextEditor = window.activeTextEditor;

        if (!activeTextEditor) {
            showErrorMessage('Could not detect Active text Editor.');
            return "";
        }

        const activeTextEditorDocument = getActiveEditorFile();

        if (activeTextEditorDocument) {
            const pathToBeImported = returnImportFilepathString(activeTextEditorDocument, targetFilePath);

            if (pathToBeImported.includes("node_modules")) {
                showInformationMessage('Detected node_modules in file path. Is this intended?');
            }

            return insertTextToActiveDocument(activeTextEditor, pathToBeImported);
        }
        
        showErrorMessage('Ooops! Unable to resolve path.');
    }));

    disposableArray.push(commands.registerCommand('relativeImport.quickPick', () => {
        workspaceFiles();
    }));

    context.subscriptions.concat(disposableArray);
}

export function deactivate() {
}