import { window, QuickPickItem } from 'vscode';

export const renderQuickpickItems = async (workspaceFiles: string[], addFilesToCache: Function) => {
    let paths: QuickPickItem[];
    let emptyItem: QuickPickItem = { label: "", description: "No files found" };
    try {
        if (workspaceFiles && workspaceFiles.length > 0) {
            paths = workspaceFiles.map((val: string) => {
                let item: QuickPickItem = { description: val, label: "" + val.split("/").pop() };
                return item;
            });
        } else {
            window.showInformationMessage('Caching files for quick access, will take a few seconds ☺️');
            await addFilesToCache();
            window.showInformationMessage('Done Caching files for quick access ☺️');
            if (workspaceFiles && workspaceFiles.length === 0) {
                paths = [emptyItem];
            } else {
                paths = workspaceFiles.map((val: string) => {
                    let item: QuickPickItem = { description: val, label: "" + val.split("/").pop() };
                    return item;
                });
            }
        }
        return paths
    } catch (err) {
        return paths = [emptyItem];
    }
};