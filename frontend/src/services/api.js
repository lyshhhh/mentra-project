const API_BASE ="mentra-project-production.up.railway.app";

export async function apiRequest(url, method = "GET", body) {
  const res = await fetch(API_BASE + url, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await res.text(); // 👈 read raw response

  // Try parsing JSON safely
  try {
    const data = JSON.parse(text);
    if (!res.ok) {
      throw new Error(data.message || "API error");
    }
    return data;
  } catch (err) {
    console.error("RAW RESPONSE FROM BACKEND:", text);
    throw new Error("Backend returned invalid response");
  }
}