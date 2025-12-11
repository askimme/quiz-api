import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 Key OpenAI depuis Render (process.env.OPENAI_API_KEY)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Route API /ask
app.post("/ask", async (req, res) => {
  const theme = req.body.theme || "mix";

  try {
    const prompt = `Génère une question de quiz (${theme}) au format JSON :
{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "answer": "réponse exacte"
}`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const text = completion.choices[0].message.content;
    const json = JSON.parse(text);

    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur API" });
  }
});

// Render écoute sur ce port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API quiz démarrée sur Port " + PORT));
