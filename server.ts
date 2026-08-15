import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Kindred - Hobby & Passion Dating' });
});

// 2. AI Icebreaker Generator: Generates 3 specific, charming conversation openers tailored to a match's hobbies & prompts
app.post('/api/ai/icebreaker', async (req, res) => {
  try {
    const { targetProfile, userProfile, specificHobby, specificPrompt } = req.body;
    const ai = getAI();

    const promptText = `
You are a witty, warm, and charming dating wingmate for a hobby-based dating app called Kindred.
Your goal is to write 3 distinct, creative, engaging, and genuine conversation openers for ${userProfile?.name || 'the user'} to send to ${targetProfile?.name || 'their match'}.

Match Details:
- Target Match Name: ${targetProfile?.name} (Age: ${targetProfile?.age})
- Bio: "${targetProfile?.bio}"
- Hobbies: ${targetProfile?.hobbies?.map((h: any) => `${h.name} (${h.skillLevel || 'Enthusiast'})`).join(', ')}
- Prompts: ${targetProfile?.prompts?.map((p: any) => `Q: ${p.question} -> A: ${p.answer}`).join(' | ')}
${specificHobby ? `- Focus on this specific hobby: ${specificHobby}` : ''}
${specificPrompt ? `- Replying to this specific prompt: "${specificPrompt.question}" Answer: "${specificPrompt.answer}"` : ''}

Generate 3 options:
1. Playful & Teasing (friendly hobby debate or light banter)
2. Curious & Genuine (asking a passionate, specific question about their craft/gear/technique)
3. Direct & Activity-oriented (proposing an easy, low-pressure first hobby meetup)

Format your response strictly as JSON with this schema:
{
  "icebreakers": [
    {
      "type": "Playful & Banter",
      "text": "...",
      "hobby": "..."
    },
    {
      "type": "Curious & Deep",
      "text": "...",
      "hobby": "..."
    },
    {
      "type": "Activity & Date Invite",
      "text": "...",
      "hobby": "..."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        icebreakers: [
          { type: 'Curious & Deep', text: `Hey ${targetProfile?.name}! I saw you're into ${targetProfile?.hobbies?.[0]?.name || 'your hobbies'}—what got you started with that?`, hobby: targetProfile?.hobbies?.[0]?.name || 'Hobby' },
          { type: 'Playful & Banter', text: `Okay, serious question: what is the most controversial opinion in the ${targetProfile?.hobbies?.[0]?.name || 'hobby'} world?`, hobby: targetProfile?.hobbies?.[0]?.name || 'Hobby' },
          { type: 'Activity & Date Invite', text: `I was thinking of checking out a local spot for ${targetProfile?.hobbies?.[0]?.name || 'coffee'} this week. Would you want to join for an easy vibe check?`, hobby: targetProfile?.hobbies?.[0]?.name || 'Hobby' },
        ]
      };
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error generating icebreakers:', error);
    res.status(500).json({
      error: 'Failed to generate icebreakers',
      details: error?.message || String(error),
      fallback: [
        { type: 'Curious & Deep', text: `Hey! I love your photo with the hobby setup. How long have you been practicing?`, hobby: 'General' },
        { type: 'Playful & Banter', text: `Any insider tips for someone who wants to get better at this?`, hobby: 'General' },
        { type: 'Activity & Date Invite', text: `Would love to trade notes over coffee sometime soon!`, hobby: 'General' }
      ]
    });
  }
});

// 3. AI Bio & Prompt Enhancer: Helps user polish their profile and prompts based on hobbies
app.post('/api/ai/bio-generator', async (req, res) => {
  try {
    const { name, occupation, hobbies, tone, lookingFor, draftBio } = req.body;
    const ai = getAI();

    const promptText = `
You are an expert profile consultant for Kindred, a passionate hobby-based dating app.
Write 3 unique, high-conversion dating bios and 3 captivating prompt answers based on this user's profile info:
- Name: ${name}
- Occupation: ${occupation}
- Hobbies: ${hobbies?.join(', ')}
- Relationship Goal: ${lookingFor}
- Preferred Tone: ${tone || 'Sincere & Witty'}
${draftBio ? `- Existing Draft: "${draftBio}"` : ''}

Rules:
- Avoid generic cliches ("I love to laugh", "fluent in sarcasm").
- Ground the bio in specific, tactile, sensory details of their hobbies (e.g. specific coffee brew methods, climbing routes, film stocks, music genres, book authors, cooking ingredients).
- Keep each bio between 2 to 3 sentences (40-65 words).

Respond in JSON format:
{
  "bioOptions": [
    { "style": "Witty & Passionate", "bio": "..." },
    { "style": "Adventurous & Direct", "bio": "..." },
    { "style": "Cozy & Deep", "bio": "..." }
  ],
  "suggestedPrompts": [
    { "question": "My ideal Sunday morning hobby ritual...", "answer": "..." },
    { "question": "The gear/project I obsess over...", "answer": "..." },
    { "question": "I will know we are compatible if...", "answer": "..." }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error('Error generating bio:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate bio' });
  }
});

// 4. AI Wingmate Multi-Turn Chat: Advice on banter, date invitations, or message coaching
app.post('/api/ai/wingmate-chat', async (req, res) => {
  try {
    const { message, conversationHistory, targetMatch, userProfile } = req.body;
    const ai = getAI();

    const systemInstruction = `
You are "Cupid's Wingmate" on Kindred, the warm, honest, and sharp AI dating coach specializing in passion and hobby-based dating.
You help users write better messages, craft confident date proposals (like asking someone to a bouldering session, coffee tasting, pottery class, or board game cafe), decode mixed signals, and stay safe and authentic.

Current User: ${userProfile?.name || 'Alex'} (Hobbies: ${userProfile?.hobbies?.map((h: any) => h.name).join(', ') || 'Coffee, Climbing, Film photo'})
Target Match: ${targetMatch ? `${targetMatch.name}, ${targetMatch.age} (${targetMatch.bio}) Hobbies: ${targetMatch.hobbies?.map((h: any) => h.name).join(', ')}` : 'None selected'}

Guidelines:
- Give concise, actionable, empathetic advice (2-4 paragraphs max).
- Provide 2 or 3 exact message templates or date ideas they can copy-paste or adapt.
- Emphasize mutual respect, clear enthusiasm, and low-pressure activity dates.
`;

    const contents: any[] = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction,
      },
    });

    res.json({
      reply: response.text || 'I am here to help you brainstorm your next date idea or message! What would you like advice on?',
    });
  } catch (error: any) {
    console.error('Error in wingmate chat:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate coach advice' });
  }
});

// 5. Google Maps Grounded Date Spot Finder: Recommends real local venues for shared hobbies
app.post('/api/ai/date-spots', async (req, res) => {
  try {
    const { locationName, sharedHobby, latitude, longitude } = req.body;
    const ai = getAI();

    const city = locationName || 'San Francisco, CA';
    const hobby = sharedHobby || 'Specialty Coffee & Bouldering';
    const lat = latitude || 37.7749;
    const lng = longitude || -122.4194;

    const promptText = `
Find 3 top-rated, authentic, local spots in ${city} for a fantastic first dating activity centered around: "${hobby}".
For example, if the hobby is coffee, find renowned artisan specialty roasters with cozy ambiance. If bouldering, find premier climbing gyms. If pottery, find ceramic studios. If board games, find cozy board game cafes with drinks and snacks.

For each spot, provide:
1. Exact Name of the venue
2. Neighborhood / District
3. Why it is the perfect low-pressure first hobby date spot
4. Specific recommendation for what to do or order there

Write in clear Markdown format with bold titles.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng,
            },
          },
        },
      },
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    res.json({
      content: text,
      groundingChunks: groundingChunks,
    });
  } catch (error: any) {
    console.error('Error finding grounded date spots:', error);
    res.status(500).json({
      content: `### Top Recommended Date Spots for ${req.body?.sharedHobby || 'Your Hobby'}\n\n1. **Sightglass Coffee Roastery** (SoMa, SF)\n- *Vibe:* Spacious two-story industrial loft with aroma of freshly roasted single-origins.\n- *Ideal Date:* Order a flight of pour-overs and find a spot on the mezzanine.\n\n2. **Mission Cliffs & Dogpatch Boulders** (SF)\n- *Vibe:* Friendly, high-energy climbing community.\n- *Ideal Date:* Bouldering session working on shared routes followed by smoothies.\n\n3. **The Game Parlour** (Inner Sunset, SF)\n- *Vibe:* Hundreds of curated board games, warm teas, and waffle sandwiches.\n- *Ideal Date:* Pick a 2-player cooperative game like Wingspan or Cascadia.`,
      groundingChunks: [],
    });
  }
});

// Vite / static middleware
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kindred server running on http://0.0.0.0:${PORT}`);
  });
}

start();
