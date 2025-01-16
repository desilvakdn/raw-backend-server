import statusCodes from "../utils/statusCodes";

const codeMap = Object.entries(statusCodes).reduce((acc, [key, value]) => {
  Object.entries(value).forEach(([keyChild, valChild]) => {
    acc.set(Number(keyChild), valChild);
  });
  return acc;
}, new Map());

const statusCodeFromValue = (code: string | number) => {
  if (!code || (typeof code === "number" && isNaN(code))) return null;
  if (typeof code != "number") code = Number(code);
  if (codeMap.has(code)) {
    return codeMap.get(code);
  }

  return null;
};

export default statusCodeFromValue;
