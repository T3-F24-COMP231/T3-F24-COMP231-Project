export const CleanOutput = (output: number | string): string => {
    let outputString = output.toString();
    let decimal = outputString.split('.')[1];
    outputString = outputString.split('.')[0];
    let outputArray = outputString.split('');

    if (outputArray.length > 3) {
        for (let i = outputArray.length - 3; i > 0; i -= 3) {
            outputArray.splice(i, 0, ",");
        }
    }

    if (decimal) {
        outputArray.push('.');
        outputArray.push(decimal);
    }

    return outputArray.join("");
};
