export function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}
export function countTokens(text: string) {
  return estimateTokens(text);
}   