export interface IWorkspaceFileManager {
    getWorkspaceFiles(): string[];
    setWorkspaceFiles(additionalWorkspaceFiles: string[]): void;
    addFileToWorkspace(additionalWorkspaceFiles: string): void;
    removeWorkspaceFile(fileToRemove: string): void;
    dispose(): void;
}

export class WorkspaceFileManager implements IWorkspaceFileManager{
    private workspaceFiles: string[];

    constructor(initialWorkspaceFiles: string[] = []) {
        this.workspaceFiles = initialWorkspaceFiles;
    }

    public getWorkspaceFiles = (): string[] => {
        return this.workspaceFiles;
    }

    public setWorkspaceFiles = (additionalWorkspaceFiles: string[]) => {
        this.workspaceFiles = additionalWorkspaceFiles;
    }

    public addFileToWorkspace = (additionalWorkspaceFiles: string) => {
        this.workspaceFiles.push(additionalWorkspaceFiles);
    }

    public removeWorkspaceFile = (fileToRemove: string) => {
        let index = this.workspaceFiles.indexOf(fileToRemove);
        if (index > -1) {
            this.workspaceFiles.splice(index, 1);
        }
    }

    public dispose = () => {
        this.workspaceFiles = [];
    }
}