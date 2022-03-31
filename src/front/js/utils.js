export const toCamelCase = (string) =>
  string
    .split("_")
    .map((word, i) =>
      i > 0 ? [word[0].toUpperCase() + word.slice([1])] : word
    )
    .join("");
