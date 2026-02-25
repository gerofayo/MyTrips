/**
 * Generates a CSS class name for a given category.
 * Converts the category to lowercase, replaces non-alphanumeric characters with hyphens,
 * and removes leading/trailing hyphens.
 * @param category - The category string
 * @returns The CSS class name prefixed with 'cat-'
 */
export const getCategoryClass = (category: string): string =>
  `cat-${category.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;