export interface ParsedPdf {
  text: string;
  numpages: number;
}

export async function parsePdf(buffer: Buffer): Promise<ParsedPdf> {
  // Node-only require avoids ESM typing issues
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pdfParse = require("pdf-parse") as (
    buffer: Buffer
  ) => Promise<ParsedPdf>;

  return pdfParse(buffer);
}
