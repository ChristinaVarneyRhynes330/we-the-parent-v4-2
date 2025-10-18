import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Splits a long text into smaller, overlapping chunks.
 * This is a key step for preparing data for Retrieval-Augmented Generation (RAG).
 * @param text The full text of the document.
 * @param chunkSize The maximum size of each chunk (in characters).
 * @param chunkOverlap The number of characters to overlap between chunks.
 * @returns An array of text chunks.
 */
export function chunkText(
  text: string, 
  chunkSize: number = 1000, 
  chunkOverlap: number = 200
): string[] {
  if (chunkSize <= chunkOverlap) {
    throw new Error("chunkSize must be greater than chunkOverlap");
  }

  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = i + chunkSize;
    chunks.push(text.slice(i, end));
    i += chunkSize - chunkOverlap;
  }
  return chunks;
}

/**
 * Generates a SHA-256 checksum for a given text string.
 * Used to detect duplicate chunks and avoid re-embedding identical content.
 * @param text The text to hash.
 * @returns A hexadecimal string representing the SHA-256 hash.
 */
export function sha256Checksum(text: string): string {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * Estimates token count for a text string.
 * Rough approximation: 1 token ≈ 4 characters for English text.
 * @param text The text to estimate.
 * @returns Estimated token count.
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Sanitizes text by removing excessive whitespace and control characters.
 * Useful for cleaning extracted text before chunking.
 * @param text The text to sanitize.
 * @returns Cleaned text.
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n') // Collapse excessive newlines
    .replace(/[ \t]{2,}/g, ' ') // Collapse excessive spaces
    .trim();
}