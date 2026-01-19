/**
 * Gets a deterministic seed based on the current date (YYYY-MM-DD)
 * This ensures the same pet is selected for the entire day
 * Same day → same seed → same petId
 */
function getDaySeed(): number {
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Calculates a deterministic pet ID for today based on the total number of pets
 *
 * This function:
 * - Uses the current date to generate a deterministic seed
 * - Calculates an index based on the total number of pets
 * - Returns a pet ID (assuming IDs are consecutive starting from 1)
 *
 * The same day will always produce the same petId for the same total.
 * Different days will potentially produce different petIds.
 *
 * @param totalPets - Total number of pets in the system
 * @returns A deterministic pet ID for today (1-based)
 *
 * @example
 * // Same day, same total → same petId
 * calculatePetIdForToday(30); // e.g., returns 15
 * calculatePetIdForToday(30); // e.g., returns 15 (same)
 *
 * // Different day → potentially different petId
 * // (next day) calculatePetIdForToday(30); // e.g., returns 7
 */
export function calculatePetIdForToday(totalPets: number): number {
  if (totalPets <= 0) {
    throw new Error('Total pets must be greater than 0');
  }

  const seed = getDaySeed();
  const index = seed % totalPets;

  // Pet IDs are 1-based, so we add 1 to the index
  return index + 1;
}

/**
 * Calculates a deterministic pet ID for today
 * This version makes a reasonable assumption about the total number of pets
 * Use this only if you cannot get the total from the API
 *
 * @deprecated Use calculatePetIdForToday(totalPets) instead
 * @returns A deterministic pet ID for today
 */
export function calculatePetIdForTodayWithDefault(): number {
  // This is a fallback that assumes a reasonable default
  // In production, you should always get the total from the API
  const DEFAULT_TOTAL = 1000; // Reasonable default for scaling
  return calculatePetIdForToday(DEFAULT_TOTAL);
}
