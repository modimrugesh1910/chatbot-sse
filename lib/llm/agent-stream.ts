import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function streamFinalAnswer(messages: any[]) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    stream: true
  });

  return response.toReadableStream();
}
