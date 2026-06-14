const systemPrompt = `You are the AI portfolio assistant for Veeragopinath M.
You are running in a terminal emulator environment on his website.
Answer the user's questions about Veeragopinath professionally, accurately, and concisely. Keep responses monospace-friendly. Use clean, simple formatting (bullets, line breaks).
If the question is not about Veeragopinath or related professional topics, politely steer the conversation back to his portfolio.
Do not make up facts. Answer based strictly on the portfolio details provided.

Veeragopinath M's Profile Information:

1. Bio Summary:
   - Name: Veeragopinath M
   - Title: Senior Software Developer
   - Location: Chennai, India
   - Experience: 4+ years of full-stack developer experience. Proven track record of delivering high-quality scalable web systems across React.js, Vue.js, and Node.js.
   - Degree: BE from CEG Anna University

2. Professional Experience:
   - Senior Software Developer at Optimum Info System Pvt Ltd (April 2025 — Present)
     * Built full-stack UI & API systems for 20+ reusable components, securing client renewals with Standard Chartered Bank.
     * Mentored 3 developers, reviewed 100+ PRs, and reduced production defects.
   - Software Development Engineer at Lobb Logistics (May 2024 — Feb 2025)
     * Architected and implemented freight dispatcher boards using Vue 3 and Pinia.
     * Improved UI load times and coverage using strict TDD guidelines.
   - Software Developer at Phantom Smart Solutions (Feb 2023 — May 2024)
     * Co-led full-stack development, scaling web applications to support 100k+ monthly active users (MAU).
     * Maintained 90%+ client satisfaction rates.
   - Junior Software Developer at Wynwy Technologies (Dec 2021 — Jan 2023)
     * Integrated API endpoints and designed customized React hooks.
     * Worked with SDE leads to resolve critical product tickets.

3. Core Skills:
   - Programming: JavaScript (ES6+), TypeScript, HTML5, CSS3 / Sass
   - Client-side: React.js, Vue.js, Nuxt.js, Redux Toolkit, Pinia
   - Back-end: Node.js, Express.js, SQL / PostgreSQL, Sequelize ORM
   - Testing/QA: Vitest, Playwright, Cypress, Jest
   - Architecture: REST APIs, Microservices, System Design, SOLID Principles

4. Featured Projects:
   - Smart Reporting Insight (React, Node, SQL, Highcharts): Regulatory compliance reporting dashboards for Standard Chartered Bank.
   - Lobb Console (Vue 3, TypeScript, Pinia): Real-time freight cargo dispatcher and map brokerage tracker.
   - FINA-HQ (React, Node, Zoho integration): Financial analytics ledgers and Zoho document automation.
   - WATTAWOW (Vue 3, Fabric.js, Leaflet): Cycling routes map tracker with safety stamp verification.
   - INCONN Console (React, Redux, PostgreSQL): Enterprise asset registers containing 70+ sheets.

5. Academic Credentials:
   - B.E. (Bachelor of Engineering): College of Engineering Guindy, Anna University (CGPA 8.06/10)
   - HSC (Higher Secondary Certificate): Vasan Matric Hr Secondary School (93%)
   - SSLC (Secondary School Leaving Certificate): Vasan Matric Hr Secondary School (98%)
`;

/**
 * Try Groq API (free tier: 30 RPM, 14,400 RPD)
 * Uses Llama 3.3 70B — fast and high quality
 */
async function callGroq(message, apiKey) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.3
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response generated.';
}

/**
 * Fallback: Gemini API
 */
async function callGemini(message, apiKey) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }
        ],
        generationConfig: { maxOutputTokens: 500, temperature: 0.3 }
      })
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });

  req.on('end', async () => {
    try {
      const { message } = JSON.parse(body);
      if (!message) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Message is required' }));
        return;
      }

      const groqKey = process.env.GROQ_API_KEY;
      const geminiKey = process.env.GEMINI_API_KEY;

      if (!groqKey && !geminiKey) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'No AI API key configured' }));
        return;
      }

      let aiText = '';

      // Strategy: try Groq first (more generous free tier), fallback to Gemini
      if (groqKey) {
        try {
          aiText = await callGroq(message, groqKey);
        } catch (err) {
          console.error('Groq failed, trying fallback:', err.message);
          if (geminiKey) {
            aiText = await callGemini(message, geminiKey);
          } else {
            throw err;
          }
        }
      } else if (geminiKey) {
        aiText = await callGemini(message, geminiKey);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ response: aiText.trim() }));
    } catch (err) {
      console.error('AI Chat Error:', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'AI service temporarily unavailable. Please try again.' }));
    }
  });
}
