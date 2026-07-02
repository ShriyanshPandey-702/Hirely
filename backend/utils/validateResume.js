const isResume = (text) => {

    const lower = text.toLowerCase();

    // Resume Indicators
    const resumeScore = [
        /@/.test(text),                         // Email
        /\+?\d[\d\s()-]{8,}/.test(text),        // Phone
        lower.includes("education"),
        lower.includes("experience"),
        lower.includes("skills"),
        lower.includes("project"),
        lower.includes("linkedin"),
        lower.includes("github"),
        lower.includes("summary"),
        lower.includes("objective"),
        lower.includes("certification"),
        lower.includes("internship"),
        lower.includes("achievement")
    ].filter(Boolean).length;

    // Documents that are usually NOT resumes
    const nonResumeWords = [
        "course code",
        "semester",
        "credits",
        "syllabus",
        "unit 1",
        "unit 2",
        "unit 3",
        "module 1",
        "module 2",
        "question paper",
        "assignment",
        "marks",
        "evaluation scheme",
        "course outcomes",
        "program outcomes",
        "laboratory",
        "experiment"
    ];

    let nonResumeScore = 0;

    for (const word of nonResumeWords) {
        if (lower.includes(word)) {
            nonResumeScore++;
        }
    }

    if (nonResumeScore >= 3) {
        return false;
    }

    return resumeScore >= 6;
};

module.exports = isResume;