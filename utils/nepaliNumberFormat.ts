/**
 * Format number to Nepali/Indian numbering system
 * Example: 1000000 -> "10,00,000"
 * Example: -200 -> "-200"
 *
 * Nepali numbering: groups of 3, 2, 2, 2... from right to left
 */
export const formatToNepaliNumber = (num: number | string): string => {
  // Convert to string if number
  let numStr = String(num);

  // Check if negative and store the sign
  let isNegative = numStr.startsWith("-");
  if (isNegative) {
    numStr = numStr.substring(1);
  }

  // Remove any existing commas
  numStr = numStr.replace(/,/g, "");

  // Handle decimal numbers
  let decimalPart = "";
  if (numStr.includes(".")) {
    const [intPart, decimal] = numStr.split(".");
    numStr = intPart;
    decimalPart = decimal;
  }

  // Reverse the string to work from right to left
  let reversed = numStr.split("").reverse().join("");

  // Apply Nepali formatting: 3 digits, then groups of 2
  let formatted = "";

  // First group: last 3 digits
  if (reversed.length > 0) {
    const firstGroup = reversed.substring(0, 3);
    formatted = firstGroup;
  }

  // Remaining groups: 2 digits each
  for (let i = 3; i < reversed.length; i += 2) {
    const group = reversed.substring(i, i + 2);
    formatted += "," + group;
  }

  // Reverse back to get correct order
  let result = formatted.split("").reverse().join("");

  // Add negative sign back if it was negative
  if (isNegative) {
    result = "-" + result;
  }

  // Add decimal part back if it exists
  if (decimalPart) {
    result += "." + decimalPart;
  }

  return result;
};

/**
 * Format currency in Nepali style with NPR symbol
 * Example: 1000000 -> "₨ 10,00,000"
 */
export const formatNepaliCurrency = (
  num: number | string,
  symbol: string = "₨",
): string => {
  return `${symbol} ${formatToNepaliNumber(num)}`;
};

/**
 * Parse Nepali formatted number back to regular number
 * Example: "10,00,000" -> 1000000
 */
export const parseNepaliNumber = (formattedNum: string): number => {
  // Remove all commas and convert to number
  const cleaned = formattedNum.replace(/,/g, "");
  return Number(cleaned);
};

// Example usage:
// formatToNepaliNumber(1000000) // "10,00,000"
// formatToNepaliNumber(123456789) // "12,34,56,789"
// formatNepaliCurrency(1000000) // "₨ 10,00,000"
// parseNepaliNumber("10,00,000") // 1000000
