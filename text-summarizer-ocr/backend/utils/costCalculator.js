export const calculateGoogleCost = (tokens) => {
    const pricePerThousandTokens = 0.002; 
    return Number(((tokens / 1000) * pricePerThousandTokens).toFixed(6));
};
  