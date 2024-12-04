import { Types } from "mongoose";

/**
 * Validates and converts a value to ObjectId or null.
 *
 * @param {string | Types.ObjectId | null} value - The value to validate and convert.
 * @returns {Types.ObjectId | null} A valid ObjectId or null.
 */
export const toObjectIdOrNull = (
  value: string | Types.ObjectId | null
): Types.ObjectId | null => {
  if (!value) return null; // Return null for falsy values
  if (Types.ObjectId.isValid(value)) {
    return new Types.ObjectId(value); // Convert valid string to ObjectId
  }
  return null; // Return null for invalid values
};
