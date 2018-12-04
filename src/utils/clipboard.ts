const copypaste = require("copy-paste");

export const copyToClipboard = (stringToCopy: string) => {
    return copypaste.copy(stringToCopy);
}