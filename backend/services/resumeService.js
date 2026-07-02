const analyzeResume = (file) => {

    return {
        success: true,
        message: "Resume uploaded successfully",

        file: {
            originalName: file.originalname,
            savedName: file.filename,
            size: file.size,
            type: file.mimetype,
            path: file.path
        }
    };
};

module.exports = {
    analyzeResume
};