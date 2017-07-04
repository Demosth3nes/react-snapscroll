export const getFactors = (n) => {
    const numFactors = [];
    let i;

    for (i = 1; i <= Math.floor(Math.sqrt(n)); i += 1) {
      if (n % i === 0) {
        numFactors.push(i);
        if (n / i !== i) {
          numFactors.push(n / i);
        }
      }
    }
    numFactors.sort((x, y) => {
      return x - y;
    }); // numeric sort

    return numFactors;
  }
