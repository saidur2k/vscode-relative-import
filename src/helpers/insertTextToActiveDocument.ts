import { TextEditor, Selections } from 'vscode';

export const insertTextToActiveDocument = (activeDocumentTextEditor: TextEditor, textToInsert: string) => {
    activeDocumentTextEditor.edit(
        (edit: Selections) => activeDocumentTextEditor.selections.forEach(
            (selection: Selections) => {
                edit.delete(selection)
                edit.insert(selection.start, textToInsert.toString())
            }
        )
    )
}