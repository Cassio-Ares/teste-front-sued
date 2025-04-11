export const formatValue = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === 0) return "-";

  if (typeof value === "number") {
    return value.toString().replace(".", ",");
  }

  return value.toString();
};

export const conversionGramsAndMl = (value: number | string, unit: string): string => {
  const valueNumber = typeof value === "string" ? parseFloat(value) : value;

  if (valueNumber < 1000 && (unit === "g" || unit === "ml")) {
    return (valueNumber / 1000).toFixed(3);
  }

  return valueNumber.toString();
};
