import * as vscode from 'vscode';

export const insertTextToActiveDocument = (activeDocumentTextEditor: vscode.TextEditor, textToInsert: string) => {
    activeDocumentTextEditor.edit(
        edit => activeDocumentTextEditor.selections.forEach(
            selection => {
                edit.delete(selection)
                edit.insert(selection.start, textToInsert.toString())
            }
        )
    )
}