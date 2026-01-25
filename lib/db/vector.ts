import { prisma } from "./prisma";

export async function similaritySearch(
  embedding: number[],
  limit = 5
) {
  return prisma.$queryRaw<
    { content: string }[]
  >`
    SELECT content
    FROM "DocumentChunk"
    ORDER BY embedding <-> ${embedding}::vector
    LIMIT ${limit};
  `;
}
