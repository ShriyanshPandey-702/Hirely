const { analyzeResume } = require("../services/resumeService");

const getResume = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No resume uploaded"
            });
        }

        const { jobDescription } = req.body;
        // console.log(jobDescription);

        const result = await analyzeResume(req.file, jobDescription);

        if (result.error) {

            return res.status(400).json({
                success: false,
                message: result.message
            });

        }

        res.json({
            success: true,
            analysis: result
        });

    } catch (error) {

    console.error(error);

    // Gemini server busy
    if (error.status === 503) {
        return res.status(503).json({
            success: false,
            message:
                "Gemini AI is currently experiencing high demand. Please wait a few seconds and try again."
        });
    }

    // Gemini rate limit exceeded
    if (error.status === 429) {
        return res.status(429).json({
            success: false,
            message:
                "Rate limit exceeded. Please wait a minute and try again."
        });
    }

    return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again."
    });

    }

};

module.exports = {
    getResume
};