const { analyzeResume } = require("../services/resumeService");

const getResume = (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No resume uploaded"
        });
    }

    const result = analyzeResume(req.file);

    res.json(result);
};

module.exports = {
    getResume
};