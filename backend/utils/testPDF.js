const extractTextFromPDF = require("./extractText");

async function test() {
    const text = await extractTextFromPDF(
        "./uploads/1782961261030-548321732.pdf"
    );

    console.log(text);
}

test();