import * as path from 'path';

const sanitizePath = (input: any) => input.toString().replace(/\\/g, "/");

export const resolveFilePathFromURI = (input: string) : string=> {
    try {
        return sanitizePath(path.resolve(input).toString());
    } catch (err) {
        throw new Error('Error resolving file path from URI')
    }
    
}

export const getDocumentDirectory = (activeDocumentFilePath: string) => {
    return sanitizePath(
        path.dirname(
            path.resolve(activeDocumentFilePath.toString()
        )
    ).toString());
}

export const returnImportFilepathString = (activeFile: string, targetFilePath: string) => {
    const resolvedActiveDirectory = sanitizePath(path.resolve(getDocumentDirectory(activeFile)))
    const resolvedTargetFile = sanitizePath(path.resolve(targetFilePath))
    
    const resolvedTargetFileDirectory = getDocumentDirectory(resolvedTargetFile)

    const relativePath = sanitizePath(path.relative(resolvedActiveDirectory, resolvedTargetFile));

    if ((resolvedActiveDirectory === resolvedTargetFileDirectory) || (resolvedTargetFileDirectory.startsWith(resolvedActiveDirectory))) {
        return './' + relativePath;
    }

    return relativePath;
}