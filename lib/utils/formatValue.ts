export const formatValue = (
  value: number | string | null | undefined
): string => {
  if (value === null || value === undefined || value === 0) return "-";

  if (typeof value === "number") {
    return value.toString().replace(".", ",");
  }

  return value.toString();
};
