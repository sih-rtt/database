/**
 * Represents a book.
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 * @returns Array of [author, book]
 */

export function Book(title: string, author: string) {
  return [author, title];
}