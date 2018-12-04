import * as path from 'path';

export const resolveFilePathFromURI = (input: string) => {
    const filepath = path.resolve(input);
    return filepath.replace(/\\/g, '/');
}

export const getActiveDocumentDirectory = (activeDocumentFilePath: string) => {
    return path.dirname(
        path.resolve(activeDocumentFilePath.toString())
    ).toString();
}

export const returnImportFilepathString = (activeFileDirectory: string, targetFilePath: string) => {
    return '' + (path.relative(path.resolve(activeFileDirectory), path.resolve(targetFilePath))).toString();
}