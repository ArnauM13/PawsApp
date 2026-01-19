import { DataViewLayout } from '@shared/ui/dataview';

/**
 * Pagination configuration per layout
 * Define the number of rows per page based on the layout
 */
export const PAGINATION_CONFIG: Record<DataViewLayout, number> = {
  list: 10,
  grid: 6
};

/**
 * Calculate the page number from the lazy load event
 * @param first - Index of the first element (0-based)
 * @param rows - Number of elements per page
 * @returns Page number (1-based)
 */
export function calculatePage(first: number, rows: number): number {
  return Math.floor(first / rows) + 1;
}

/**
 * Calculate the index of the first element (first) from the page number
 * @param page - Page number (1-based)
 * @param rows - Number of elements per page
 * @returns Index of the first element (0-based)
 */
export function calculateFirst(page: number, rows: number): number {
  return (page - 1) * rows;
}

/**
 * Get the number of rows per page based on the layout
 * @param layout - Layout (list or grid)
 * @returns Number of rows per page
 */
export function getRowsPerPage(layout: DataViewLayout): number {
  return PAGINATION_CONFIG[layout];
}
