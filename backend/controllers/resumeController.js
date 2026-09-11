const { analyzeResume } = require('../utils/geminiAi');
const mammoth = require('mammoth');

const uploadAndAnalyze = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'Please upload at least one resume' });
        if (!req.body.jobDescription) return res.status(400).json({ error: 'Job Description is required' });

        const allResults = [];
        console.log(`🚀 Processing ${req.files.length} resumes for Leaderboard...`);

        for (const file of req.files) {
            let resumeContent;
            const fileName = file.originalname.toLowerCase();

            // SMART CHECK: Using extension instead of strict mimetype
            if (fileName.endsWith('.pdf')) {
                resumeContent = {
                    inlineData: {
                        data: file.buffer.toString("base64"),
                        mimeType: "application/pdf"
                    }
                };
            } else if (fileName.endsWith('.docx')) {
                const result = await mammoth.extractRawText({ buffer: file.buffer });
                resumeContent = `Candidate Resume Text: \n ${result.value}`;
            } else {
                console.log(`⚠️ Skipped unsupported file: ${file.originalname}`);
                continue;
            }

            try {
                const aiAnalysis = await analyzeResume(resumeContent, req.body.jobDescription);
                aiAnalysis.filename = file.originalname;
                allResults.push(aiAnalysis);
                console.log(`✅ Successfully analyzed: ${file.originalname}`);
            } catch (error) {
                console.error(`❌ AI Error for ${file.originalname}:`, error.message);
                allResults.push({
                    filename: file.originalname,
                    match_percentage: 0,
                    matched_keywords: [],
                    missing_keywords: [],
                    important_jd_keywords: [],
                    short_summary: "AI failed to analyze this specific file. Ensure it's a readable text PDF.",
                    ats_readability: { score: 0, feedback: "Unreadable format." },
                    cover_letter: "Error generating cover letter."
                });
            }
        }

        allResults.sort((a, b) => b.match_percentage - a.match_percentage);

        res.json({ success: true, message: '🚀 AI Bulk Analysis Complete!', data: allResults });

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ error: 'Internal Server Error. Check terminal.' });
    }
};

module.exports = { uploadAndAnalyze };