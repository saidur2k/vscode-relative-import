import { window, QuickPickItem } from 'vscode';
import { fetchQuickpickItems } from './fetchQuickpickItems';
import { insertTextToActiveDocument } from '../insertTextToActiveDocument';
import { WorkspaceFileManager } from '../../WorkspaceFileManager';
import { RelativeImport } from '../../RelativeImport';

export const renderAndInsertFileFromQuickPick = (workspaceFileManager: WorkspaceFileManager, relativeImport: RelativeImport): void => {
    let paths: Promise<QuickPickItem[]> = fetchQuickpickItems(workspaceFileManager);

    const activeTextEditor = window.activeTextEditor;

    if (!activeTextEditor) {
        throw new Error('Could not detect Active text Editor.');
    }

    paths.then((filePaths: QuickPickItem[]) => {
        let pickResult: Thenable<QuickPickItem | undefined>;

        if (filePaths && filePaths.length > 0) {
            pickResult = window.showQuickPick(filePaths, { matchOnDescription: true, placeHolder: `Type to filter ${filePaths.length} files` });
        } else {
            pickResult = window.showQuickPick(filePaths, { matchOnDescription: true, placeHolder: `Loooking up files` });
        }

        pickResult.then((item: QuickPickItem | undefined) => {

            if (item && item.description) {
                relativeImport.targetFile = item.description;
                return insertTextToActiveDocument(relativeImport.getRelativePath());
            }
        });
    });
};