export const toSnakeCase = (filter) => {
  const arr = filter.split("");
  let snakeCase = "";
  for (let char of arr) {
    if (char === char.toUpperCase() && char !== char.toLowerCase())
      snakeCase = snakeCase.concat(`_${char.toLowerCase()}`);
    else snakeCase = snakeCase.concat(char);
  }
  return snakeCase;
};
