// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const body = req.body;
  console.log(body);
  const prompt = `Write a long form ${body.genre} story which has a ${body.characters[0]} and a ${body.characters[1]}`;
  console.log(prompt);
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: prompt,
    temperature: 0.7,
    max_tokens: 3000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return res.status(200).json({ data: response.choices[0].text });
} 
