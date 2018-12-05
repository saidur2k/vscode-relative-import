import { window } from 'vscode';

export const getActiveEditorFile = () => {
    const activeTextEditor = window.activeTextEditor;

    if (!activeTextEditor) {
        window.showErrorMessage('Could not detect Active text Editor.');
        return "";
    }

    const activeTextEditorDocument = activeTextEditor.document;

    if (!(activeTextEditorDocument.uri && activeTextEditorDocument.uri.scheme)) {
        window.showErrorMessage('Could not detect active text editor file.');
        return "";
    }

    if (activeTextEditorDocument.uri.scheme === 'file') {
        return activeTextEditorDocument.fileName;
    } else {
        window.showErrorMessage('Unable to resolve path. Check if the file is in disk.');
        return "";
    }
}