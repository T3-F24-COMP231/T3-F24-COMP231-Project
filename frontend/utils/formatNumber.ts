export const formatNumber = (output: any) => {
    let outputString = output.toString();
    let decimal = outputString.split('.')[1];
    outputString = outputString.split('.')[0];
  
    let suffix = '';
    if (outputString >= 1000000000) {
      suffix = 'B';
      outputString = (outputString / 1000000000).toFixed(1);
    } else if (outputString >= 1000000) {
      suffix = 'M';
      outputString = (outputString / 1000000).toFixed(1);
    } else if (outputString >= 1000) {
      suffix = 'K';
      outputString = (outputString / 1000).toFixed(1);
    }
  
    if (decimal) {
      outputString = `${outputString}.${decimal}`;
    }
    return `${outputString}${suffix}`;
  };