import { window, TextEditor, TextEditorEdit, Selection } from 'vscode';

export const insertTextToActiveDocument = (textToInsert: string) => {
    const activeTextEditor: TextEditor | undefined = window.activeTextEditor;

    if (!activeTextEditor) {
        throw new Error('Could not detect Active text Editor.');
    }

    activeTextEditor.edit(
        (edit: TextEditorEdit) => activeTextEditor.selections.forEach(
            (selection: Selection) => {
                edit.delete(selection);
                edit.insert(selection.start, textToInsert.toString());
            }
        )
    );
};