import { DataViewLayout } from '../ui/dataview/dataview.component';

/**
 * Configuració de paginació per layout
 * Defineix quantes files mostrar per pàgina segons el tipus de layout
 */
export const PAGINATION_CONFIG: Record<DataViewLayout, number> = {
  list: 10,
  grid: 6
};

/**
 * Calcula el número de pàgina a partir de l'event de lazy load
 * @param first - Índex del primer element (0-based)
 * @param rows - Nombre d'elements per pàgina
 * @returns Número de pàgina (1-based)
 */
export function calculatePage(first: number, rows: number): number {
  return Math.floor(first / rows) + 1;
}

/**
 * Obté el nombre de files per pàgina segons el layout
 * @param layout - Layout actual (list o grid)
 * @returns Nombre de files per pàgina
 */
export function getRowsPerPage(layout: DataViewLayout): number {
  return PAGINATION_CONFIG[layout];
}
