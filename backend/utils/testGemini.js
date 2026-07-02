require("dotenv").config();

const ai = require("../config/gemini");

async function testGemini() {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Say Hello from Gemini.",
    });

    console.log(response.text);
}

testGemini();