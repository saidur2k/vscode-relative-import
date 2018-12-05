import { window, QuickPickItem, Thenable } from 'vscode';
import { renderQuickpickItems } from './renderQuickpickItems';
import { getActiveEditorFile } from './getActiveEditorFile';
import { insertTextToActiveDocument } from './insertTextToActiveDocument';
import { returnImportFilepathString } from '../filesystem.utils';

export const renderAndInsertFileFromQuickPick = async(workspaceFiles: string[], addFilesToCache: Function) => {
    let paths: QuickPickItem[] = await renderQuickpickItems(workspaceFiles, addFilesToCache);

    const activeTextEditor = window.activeTextEditor;

    if (!activeTextEditor) {
        throw new Error('Could not detect Active text Editor.')
    }

    let pickResult: Thenable<QuickPickItem | undefined>;
    pickResult = window.showQuickPick(paths, { matchOnDescription: true, placeHolder: `Type to filter ${workspaceFiles.length} files` });
    pickResult.then((item: QuickPickItem | undefined) => {
        const activeTextEditorDocument = getActiveEditorFile();

        if (activeTextEditorDocument && item && item.description) {
            const pathToBeImported = returnImportFilepathString(activeTextEditorDocument, item.description);
            return insertTextToActiveDocument(activeTextEditor, pathToBeImported);
        }
    });
}