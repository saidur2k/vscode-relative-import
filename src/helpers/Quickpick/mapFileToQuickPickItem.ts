import { QuickPickItem } from 'vscode';

export const mapFileToQuickPickItem = (file: string): QuickPickItem => {
    const item: QuickPickItem = {
        description: file,
        label: "" + file.split("/").pop()
    };

    return item;
};