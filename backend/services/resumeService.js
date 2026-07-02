const ai = require("../config/gemini");
const extractTextFromPDF = require("../utils/extractText");
const isResume = require("../utils/validateResume");

const analyzeResume = async (file) => {

    const resumeText = await extractTextFromPDF(file.path);

    if (!isResume(resumeText)) {

        return {
            error: true,
            message: "The uploaded file is not a resume. Please upload a valid resume."
        };

    }

    const prompt = `
    You are an expert ATS (Applicant Tracking System) Resume Analyzer.

    Analyze the following resume carefully and evaluate it like a professional recruiter.

    Return ONLY valid JSON.

    Response format:

    {
    "score": number,
    "strengths": [],
    "weaknesses": [],
    "suggestions": []
    }

    Rules:

    - Score must be between 0 and 100.
    - Return exactly 5 strengths.
    - Return exactly 5 weaknesses.
    - Return exactly 5 suggestions.
    - Each point should be concise (approximately 5–10 words).
    - Use concise bullet-style phrases.
    - Do NOT write long sentences.
    - Do NOT explain your reasoning.
    - Do NOT include markdown.
    - Do NOT include headings.
    - Do NOT return any text outside the JSON.
    - Ensure the JSON is syntactically valid and can be parsed directly with JSON.parse().
    - Keep the feedback ATS-focused and professional.
    - Each array must contain exactly 5 unique items.
    - Do not repeat the same advice.
    - Each item should be a standalone phrase.

    Example:

    "Strong technical skills"

    NOT

    "The resume demonstrates strong technical skills in modern web development."

    Resume:

    ${resumeText}
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    let text = response.text;

    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "").trim();

    return JSON.parse(text);
};

module.exports = {
    analyzeResume,
};