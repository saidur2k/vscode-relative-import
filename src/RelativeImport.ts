import { window } from 'vscode';
import { resolveFilePathFromURI, sanitizePath, getDocumentDirectory, getRelativePath } from './filesystem.utils';
import { getWorkspaceFolder } from './helpers/getWorkspaceFolder';

const copypaste = require("copy-paste");

export class RelativeImport {
    private _workspacePath: string;
    private _targetFile: string =  '';

    constructor() {
        this._workspacePath = getWorkspaceFolder();
    }

    get currentWorkspacePath() : string {
        return this._workspacePath;
    }

    set currentWorkspacePath(path: string) {
        this._workspacePath = sanitizePath(path);
    }

    static activeSourceFile(): string {
        const activeTextEditor = window.activeTextEditor;

        if (!activeTextEditor) {
            throw new Error('Could not detect Active text Editor.');
        }

        const activeTextEditorDocument = activeTextEditor.document;

        if (!(activeTextEditorDocument.uri && activeTextEditorDocument.uri.scheme)) {
            throw new Error('Could not detect active text editor file.');
        }

        if (activeTextEditorDocument.uri.scheme === 'file') {
            return activeTextEditorDocument.fileName;
        } else {
            throw new Error('Unable to resolve path. Check if the file is in disk.');
        }
    }

    get targetFile():string {
        return this._targetFile;
    }

    set targetFile(file: string) {
        if(file) {
            const targetFilePath = resolveFilePathFromURI(file);
            copypaste.copy(targetFilePath);
            window.showInformationMessage(`Copied ${targetFilePath} to clipboard for re-use.`);
            this._targetFile = sanitizePath(file);
        } else {
            window.showErrorMessage('Error setting target file path.');
            throw new Error('Error setting target file path.');
        }
    }

    public getRelativePath = (): string => {
        const sourceDirectory: string = getDocumentDirectory(RelativeImport.activeSourceFile());
        const targetDirectory: string = getDocumentDirectory(this._targetFile);
        const relativePath: string = getRelativePath(sourceDirectory, this._targetFile);

        if ((sourceDirectory === targetDirectory) || (targetDirectory.startsWith(sourceDirectory))) {
            return './' + relativePath;
        }

        return relativePath;
    }

    public dispose() {
        this._workspacePath = '';
        this._targetFile = '';
    }
}