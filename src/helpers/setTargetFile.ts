import { window } from 'vscode';
import { resolveFilePathFromURI } from '../filesystem.utils';

const copypaste = require("copy-paste");

export const setTargetFile = (input: string) => {
    if(input) {
        const targetFilePath = resolveFilePathFromURI(input)
        copypaste.copy(targetFilePath);
        window.showInformationMessage(`Copied ${targetFilePath} to clipboard for re-use.`)
        return targetFilePath
    } else {
        window.showErrorMessage('Error setting target file path.');
        return ""
    }
}