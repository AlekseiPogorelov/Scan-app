export const validateINN = (inn) => {
  if (!inn) return false;
  if (inn.length !== 10) return false;

  const weights = [2, 4, 10, 3, 5, 9, 4, 6, 8];
  let sum = 0;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(inn[i]) * weights[i];
  }

  const control = (sum % 11) % 10;
  return control === parseInt(inn[9]);
};
