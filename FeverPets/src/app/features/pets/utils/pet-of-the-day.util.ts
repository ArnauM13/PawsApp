import { Pet } from '@features/pets/models';

/**
 * Gets a deterministic seed based on the current date (YYYY-MM-DD)
 * This ensures the same pet is selected for the entire day
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
 * Selects a pet of the day based on the current date
 * The same pet will be selected for the entire day
 * Pets are sorted by ID to ensure consistent selection even if the order changes
 * @param pets Array of all pets
 * @returns The selected pet of the day
 */
export function getPetOfTheDay(pets: Pet[]): Pet | null {
  if (pets.length === 0) {
    return null;
  }

  const sortedPets = [...pets].sort((a, b) => a.id - b.id);

  const seed = getDaySeed();
  const index = seed % sortedPets.length;
  return sortedPets[index];
}
