import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ask", async (req, res) => {
  const apiKey = process.env.OPENAI_KEY;
  const theme = req.body.theme;

  const prompt = `Génère une question de quiz sur le thème "${theme}" en JSON :
{
  "question": "...",
  "answers": ["A","B","C"],
  "correct": "A"
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log("API démarrée sur Render"));
