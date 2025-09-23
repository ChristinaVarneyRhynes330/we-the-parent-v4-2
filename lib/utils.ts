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