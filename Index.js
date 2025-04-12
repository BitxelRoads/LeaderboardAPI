export default async function handler(req, res) {
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw5I-1oT8BJlToBAqmNxmjQBQM26ROTJl5LBTeLwefTSYRRDlNnO5gaQFISioScq0dYbg/exec";
  const SECRET_TOKEN = "TutaitaTuturuma11";

  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = {};

  if (req.headers["content-type"]?.includes("application/json")) {
    body = req.body;
  } else if (req.headers["content-type"]?.includes("form-data")) {
    const formData = await req.formData();
    for (const [key, value] of formData.entries()) {
      body[key] = value;
    }
  } else {
    return res.status(400).json({ error: "Unsupported content type" });
  }

  const { action, name, score, time } = body;

  if (!["save", "get"].includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

  const data = {
    action,
    name,
    score,
    time,
    token: SECRET_TOKEN
  };

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
