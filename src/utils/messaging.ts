export const showInformationMessage = (informationMessageHandler, message) => {
    return informationMessageHandler(message);
}

export const showErrorMessage = (errorMessageHandler, message) => {
    return errorMessageHandler(message);
}