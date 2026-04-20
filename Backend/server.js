const express = require("express");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// 🏥 Health Check
app.get("/", (req, res) => res.json({ status: "Backend is running" }));

// ✅ UNIVERSAL KEYWORDS LIST (VERY IMPORTANT)
const SKILLS = [
    "javascript", "react", "node", "express", "mongodb",
    "java", "spring", "hibernate",
    "python", "django", "flask",
    "c++", "c", "typescript",
    "html", "css", "tailwind",
    "aws", "docker", "kubernetes",
    "sql", "mysql", "postgresql",
    "git", "github",
    "rest api", "graphql",
    "redux", "next.js"
];

// ✅ Extract text from resume
async function extractText(filePath, mimetype) {
    console.log(`Processing file: ${filePath} (${mimetype})`);
    if (mimetype === "application/pdf") {
        const parser = new PDFParse({ data: fs.readFileSync(filePath) });
        await parser.load();
        const textResult = await parser.getText();
        // Handle various return types from different pdf-parse versions/forks
        const text = typeof textResult === "string" ? textResult : (textResult.text || JSON.stringify(textResult));
        return text.toLowerCase();
    } else if (mimetype === "text/plain") {
        return fs.readFileSync(filePath, "utf8").toLowerCase();
    } else {
        // Assume .docx or other formats mammoth can handle
        try {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value.toLowerCase();
        } catch (err) {
            console.error("Mammoth extraction failed:", err);
            throw new Error("Unsupported file format or corrupted document.");
        }
    }
}

// ✅ Extract keywords
function extractSkills(text) {
    return SKILLS.filter(skill => text.includes(skill));
}

// ✅ Calculate score (STRICT MODE)
function calculateScore(resumeSkills, jobSkills) {
    if (jobSkills.length === 0) return 0;
    let matchCount = 0;

    jobSkills.forEach(skill => {
        if (resumeSkills.includes(skill)) {
            matchCount++;
        }
    });

    // Base score is 85% of physical match to make it stricter
    let score = (matchCount / jobSkills.length) * 85;
    
    // Diversity bonus (Max +8%) if they have skills from multiple categories
    if (resumeSkills.length > 8) score += 8;

    // HARD CAP: No resume gets 100%
    return Math.min(Math.round(score), 96);
}

// 🚀 MAIN API
app.post("/ats-score", upload.single("resume"), async (req, res) => {
    try {
        const file = req.file;
        const jobDescription = (req.body.jobDescription || "").toLowerCase();

        // 1. Extract resume text
        const resumeText = await extractText(file.path, file.mimetype);

        // 2. Extract skills
        const resumeSkills = extractSkills(resumeText);
        
        let score = 0;
        let jobSkills = [];
        let analysisType = "Match Score";

        if (jobDescription.trim()) {
            jobSkills = extractSkills(jobDescription);
            score = calculateScore(resumeSkills, jobSkills);
        } else {
            // Strict Profile Strength Score: Target 18 skills for ~80%
            score = (resumeSkills.length / 18) * 80;
            // Hard Cap for General Profile at 92%
            score = Math.min(score, 92);
            analysisType = "Profile Strength";
        }

        res.json({
            score: Math.round(score),
            resumeSkills: resumeSkills || [],
            jobSkills: jobSkills || [],
            missingSkills: jobDescription.trim() ? jobSkills.filter(skill => !resumeSkills.includes(skill)) : [],
            analysisType: analysisType
        });

    } catch (err) {
        console.error("❌ BACKEND ERROR:", err);
        res.status(500).json({ error: err.message || "Something went wrong" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));