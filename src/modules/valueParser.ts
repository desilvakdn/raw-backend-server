const parseValue = (value: string) => {
  if (!value || value.trim() === "") return undefined;

  if (value === "null") return null;

  if (value === "true" || value === "false") {
    return value === "true";
  }

  if (!isNaN(Number(value))) {
    return Number(value);
  }

  try {
    const json = JSON.parse(value);
    return json;
  } catch (error) {}

  return value;
};

export default parseValue;
