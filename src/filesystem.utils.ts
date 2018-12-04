import * as path from 'path';

export const resolveFilePathFromURI = (input: string) : string=> {
    try {
        return path.resolve(input).toString();
    } catch (err) {
        throw new Error('Error resolving file path from URI')
    }
    
}

export const getDocumentDirectory = (activeDocumentFilePath: string) => {
    return path.dirname(
        path.resolve(activeDocumentFilePath.toString())
    ).toString();
}

export const returnImportFilepathString = (activeFile: string, targetFilePath: string) => {
    const resolvedActiveDirectory = path.resolve(getDocumentDirectory(activeFile))
    const resolvedTargetFile = path.resolve(targetFilePath)
    
    const resolvedTargetFileDirectory = getDocumentDirectory(resolvedTargetFile.toString())

    const relativePath = path.relative(resolvedActiveDirectory, resolvedTargetFile).toString();
    if ((resolvedActiveDirectory === resolvedTargetFileDirectory) || (resolvedTargetFileDirectory.startsWith(resolvedActiveDirectory))) {
        return './' + relativePath;
    }

    return relativePath;
}