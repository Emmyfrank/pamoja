import OpenAI from "openai";

export const configureOpenAI = () => {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENAI_APIKEY,
  });

  return openai;
};
