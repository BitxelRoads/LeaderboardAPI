export default async function handler(request, response) {
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw5I-1oT8BJlToBAqmNxmjQBQM26ROTJl5LBTeLwefTSYRRDlNnO5gaQFISioScq0dYbg/exec";
  const SECRET_TOKEN = "TutaitaTuturuma11";

  if (request.method !== "POST" && request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const contentType = request.headers["content-type"] || "";
    let body = {};

    if (contentType.includes("application/json")) {
      body = request.body;
    } else if (contentType.includes("form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      body = request.body;
    } else {
      return response.status(400).json({ error: "Unsupported content type" });
    }

    const { action, name, score, time } = body;

    if (!action || !["save", "get"].includes(action)) {
      return response.status(400).json({ error: "Invalid action" });
    }

    const data = {
      action,
      name,
      score,
      time,
      token: SECRET_TOKEN
    };

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
}
