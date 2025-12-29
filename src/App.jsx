import { useState } from 'react';
import './App.css'; 

function App() {
  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const API_KEY = import.meta.env.VITE_API_KEY; 

  async function handleSimplify() {
    if (!inputText) return;
    setLoading(true);
    setResponseText("");
    setErrorMsg("");

    try {
      const modelName = "gemini-2.5-flash";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Explain this like I'm 5, give 3 bullet points, and 1 quiz question: ${inputText}`
              }]
            }]
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Unknown error from Google");
      }
      const text = data.candidates[0].content.parts[0].text;
      setResponseText(text);

    } catch (error) {
      console.error("Error:", error);
      setErrorMsg(error.message);
    }

    setLoading(false);
  }

  return (
    <div className="container">
      <h1>🧠 Smart Study Simplifier</h1>
      <textarea
        className="input-box"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste text here..."
      />

      <div className="button-container">
        <button onClick={handleSimplify} disabled={loading}>
          {loading ? "Simplifying..." : "Simplify My Notes"}
        </button>
      </div>

      {errorMsg && (
        <div style={{color: "red", marginTop: "20px", fontWeight: "bold"}}>
          ⚠️ Error: {errorMsg}
        </div>
      )}

      {responseText && (
        <div className="result-box">
          <h3>✨ Simplified Explanation:</h3>
          <pre>{responseText}</pre>
        </div>
      )}
    </div>
  );
}

export default App;