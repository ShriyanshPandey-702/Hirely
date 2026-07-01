const { analyzeResume } = require("../services/resumeService");

const getResume = (req, res) => {

    const result = analyzeResume();

    res.json(result);

};

module.exports = {
    getResume
};