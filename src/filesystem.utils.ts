import * as path from 'path';

export const sanitizePath = (input: string): string => {
    const sanitizedInputString: string = input.replace(/\\/g, "/");
    return (path.resolve(sanitizedInputString)).toString();
};

export const resolveFilePathFromURI = (input: string) : string => {
    try {
        const inputString: string = input.toString();
        const resolvedPathString: string = (path.resolve(inputString)).toString();
        return sanitizePath(resolvedPathString);
    } catch (err) {
        throw new Error('Error resolving file path from URI');
    }
};

export const getDocumentDirectory = (filePath: string): string  => {
    const resolvedPathString = resolveFilePathFromURI(filePath);
    const directoryNameString = (path.dirname(resolvedPathString)).toString();
    return sanitizePath(directoryNameString);
};

export const getRelativePath = (from: string, to: string): string => {
    const fromString = resolveFilePathFromURI(from);
    const toString = resolveFilePathFromURI(to);
    const resolvedString = (path.relative(fromString, toString)).toString();
    return resolvedString;
};