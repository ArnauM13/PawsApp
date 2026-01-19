/**
 * Gets a deterministic seed based on the current date (YYYY-MM-DD)
 * This ensures the same pet is selected for the entire day
 * Same day → same seed → same petId
 */
export function getDaySeed(): number {
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
 * calculatePetIdForToday(30); // e.g., returns 15
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
