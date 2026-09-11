const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Chinna Wait panna vaikura function (Delay)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const analyzeResume = async (resumeContent, jobDescription) => {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-3.6-flash", 
        generationConfig: { responseMimeType: "application/json" } 
    });

    const promptText = `
    Act as an Expert IT Technical Recruiter and Data Analyst. I have attached a Candidate's Resume.
    Please compare it strictly ONLY with the following Job Description.
    
    Job Description:
    ${jobDescription}
    
    INSTRUCTIONS FOR KEYWORD CALCULATION (CRITICAL):
    - Set A: Skills required in the JD.
    - Set B: Skills present in the Resume.
    - "matched_keywords": Must be EXACTLY the intersection of Set A and Set B.
    - "missing_keywords": Must be EXACTLY Set A minus Set B. (If a skill is in 'matched_keywords', it MUST NEVER appear in 'missing_keywords').
    - "important_jd_keywords": Top 5-7 absolutely critical skills from Set A.
    
    Provide a JSON output with exactly these 7 keys:
    1. "match_percentage": A number from 0 to 100 representing how well the resume fits the exact job description.
    2. "matched_keywords": Array of skills found in BOTH JD and Resume.
    3. "missing_keywords": Array of skills found in JD but COMPLETELY MISSING from Resume.
    4. "important_jd_keywords": Array of absolute MUST-HAVE skills explicitly emphasized in the JD.
    5. "short_summary": A 2-sentence summary explaining fit/gaps.
    6. "ats_readability": A JSON object with "score" (0-100) and "feedback" (1 sentence advising if they need to remove complex tables, images, or weird fonts).
    7. "cover_letter": A professional, 3-paragraph cover letter tailored to this JD.
    
    Return ONLY valid JSON.
    `;


    let finalPayload = typeof resumeContent === 'string' 
        ? promptText + "\n\n" + resumeContent 
        : [{ text: promptText }, resumeContent];

    // 🚀 RETRY MECHANISM: Server busy-a iruntha 3 thadava try pannum
    let retries = 3;
    while (retries > 0) {
        try {
            const result = await model.generateContent(finalPayload);
            let responseText = result.response.text();
            
            // Clean JSON
            responseText = responseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
            
            return JSON.parse(responseText);
            
        } catch (error) {
            // Error 503 (Server Busy) illana 429 (Quota limit) vanthaal wait pannum
            if ((error.message.includes('503') || error.message.includes('429')) && retries > 1) {
                console.log(`⚠️ Google API Limit (429/503). Retrying in 15 seconds... (${retries - 1} left)`);
                await sleep(15000); // 429 error vantha 15 seconds long wait pannanum
                retries--;
            } else {
                throw error; 
            }
        }
    }
};

module.exports = { analyzeResume };