const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw5I-1oT8BJlToBAqmNxmjQBQM26ROTJl5LBTeLwefTSYRRDlNnO5gaQFISioScq0dYbg/exec";
const SECRET_TOKEN = "TutaitaTuturuma11";
const GAME_SECRET = "TutaitaTuturuma11"; // ✅ clave privada entre tu juego y tu API

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('/', async (request, response) => {
  try {
    let body = {};

    if (request.method === "GET") {
      body = request.query;
    } else if (request.headers["content-type"]?.includes("application/json")) {
      body = request.body;
    } else if (request.headers["content-type"]?.includes("form-data") || request.headers["content-type"]?.includes("application/x-www-form-urlencoded")) {
      body = request.body;
    } else {
      return response.status(400).json({ error: "Unsupported content type" });
    }

    const { action, name, score, time, game_secret } = body;

    // 🔒 Verificar clave secreta del juego
    if (game_secret !== GAME_SECRET) {
      return response.status(403).json({ error: "Unauthorized" });
    }

    if (!action || !["save", "get"].includes(action)) {
      return response.status(400).json({ error: "Invalid action" });
    }

    const data = { action, name, score, time, token: SECRET_TOKEN };

    const googleResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const googleData = await googleResponse.json();
    response.status(200).json(googleData);

  } catch (error) {
    console.error("API error:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
