require('dotenv').config();

async function checkModels() {
    console.log("🔍 Checking Google for unlocked models for your API key...\n");
    try {
        const key = process.env.GEMINI_API_KEY;
        if (!key || key.includes("unga_unmaiyana_key")) {
            console.log("❌ ERROR: Please put your REAL Gemini API key in the .env file!");
            return;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            console.log("❌ API KEY ERROR:", data.error.message);
            return;
        }

        console.log("✅ YOUR KEY CAN USE THESE EXACT MODELS:");
        data.models.forEach(model => {
            if (model.supportedGenerationMethods.includes("generateContent")) {
                console.log(`-> ${model.name.replace('models/', '')}`);
            }
        });
        
    } catch (error) {
        console.error("Fetch Error:", error.message);
    }
}

checkModels();