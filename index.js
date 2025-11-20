import axios from "axios";

const SERVICE_ID = process.env.RENDER_SERVICE_ID;  // Render service ID
const API_KEY = process.env.RENDER_API_KEY;        // Render API Key
const LOGSTASH_URL = process.env.LOGSTASH_URL;    // Logstash HTTP endpoint (e.g., http://localhost:5044)

async function forwardLogs() {
  try {
    // Fetch the last 100 logs
    const res = await axios.get(
      `https://api.render.com/v1/services/${SERVICE_ID}/logs?limit=100`,
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );

    const logs = res.data;
    if (logs.length === 0) return;

    // Send logs to Logstash
    await axios.post(LOGSTASH_URL, logs, {
      headers: { "Content-Type": "application/json" }
    });

    console.log(`Sent ${logs.length} logs`);
  } catch (err) {
    console.error("Error sending logs:", err.message);
  }
}

// Poll every 5 seconds
setInterval(forwardLogs, 5000);
