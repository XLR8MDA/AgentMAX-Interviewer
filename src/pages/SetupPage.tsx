import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInterviewStore } from "../lib/interview-store";
import "../App.scss"; // Reuse existing styles for now or creating specific ones

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;

export default function SetupPage() {
    const navigate = useNavigate();
    const {
        resumeText,
        jobDescription,
        setResumeText,
        setJobDescription,
        setGeneratedQuestions,
        setIsGenerating,
        isGenerating
    } = useInterviewStore();

    const [error, setError] = useState<string | null>(null);
    const [showFallback, setShowFallback] = useState(false);

    const defaultQuestions = [
        "Can you tell me about yourself and your background?",
        "What interests you about this specific role?",
        "Tell me about a challenging technical project you've worked on recently.",
        "How do you stay updated with the latest trends in your field?",
        "Describe a situation where you had to work with a difficult team member.",
        "What are your greatest professional strengths?",
        "Where do you see yourself in five years?",
        "How do you prioritize your work when you have multiple competing deadlines?",
        "Tell me about a time you failed and what you learned from it.",
        "Do you have any questions for me?"
    ];

    const useFallback = () => {
        setGeneratedQuestions(defaultQuestions);
        navigate("/interview");
    };

    const handleGenerate = async () => {
        if (!resumeText || !jobDescription) {
            setError("Please provide both Resume and Job Description.");
            return;
        }
        setError(null);
        setIsGenerating(true);

        try {
            const prompt = `
        You are an expert HR Interviewer.
        Based on the following Candidate Resume and Job Description, prepare a list of 10 in-depth interview questions.
        
        RESUME:
        ${resumeText}

        JOB DESCRIPTION:
        ${jobDescription}

        CRITICAL: Output ONLY a valid JSON array of 10 strings. Do not include any other text, markdown formatting, or explanations.
      `;

            console.log("Generating questions with prompt...");

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error Response:", errorData);
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("API Response Data:", data);

            let jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (jsonText) {
                console.log("Raw JSON text from model:", jsonText);
                // Robust JSON extraction: find the first '[' and last ']'
                const startIdx = jsonText.indexOf('[');
                const endIdx = jsonText.lastIndexOf(']');

                if (startIdx !== -1 && endIdx !== -1) {
                    jsonText = jsonText.substring(startIdx, endIdx + 1);
                }

                const questions = JSON.parse(jsonText);
                console.log("Parsed questions:", questions);

                if (Array.isArray(questions) && questions.length > 0) {
                    setGeneratedQuestions(questions);
                    navigate("/interview");
                } else {
                    throw new Error("Model returned an empty or invalid question list.");
                }
            } else {
                throw new Error("No response content from model");
            }

        } catch (e: any) {
            console.error("Error generating questions:", e);
            if (e.message.includes("429")) {
                setError("API Rate Limit reached (Too Many Requests). You can try again in a minute or proceed with default questions.");
                setShowFallback(true);
            } else {
                setError(e.message || "Failed to generate questions. Please try again.");
            }
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="App" style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e1e1e', color: '#fff' }}>
            <div style={{ maxWidth: '800px', width: '100%', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '3rem', margin: '0', background: 'linear-gradient(45deg, #4a90e2, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Clofii</h1>
                    <p style={{ color: '#888', fontStyle: 'italic', marginTop: '0.5rem' }}>
                        Candidate Level Optimization & Flow-based Interactive Interviewer
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Paste Resume</label>
                        <textarea
                            style={{ width: '100%', height: '300px', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#2d2d2d', color: '#fff' }}
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Paste candidate resume here..."
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Job Description</label>
                        <textarea
                            style={{ width: '100%', height: '300px', padding: '10px', borderRadius: '8px', border: '1px solid #444', background: '#2d2d2d', color: '#fff' }}
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste job description here..."
                        />
                    </div>
                </div>

                {error && (
                    <div style={{ color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                        {showFallback && (
                            <div style={{ marginTop: '10px' }}>
                                <button
                                    onClick={useFallback}
                                    style={{ background: 'transparent', border: '1px solid #4a90e2', color: '#4a90e2', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Proceed with Default Questions
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ textAlign: 'center' }}>
                    <button
                        className="action-button"
                        style={{
                            padding: '12px 24px',
                            fontSize: '1.2rem',
                            backgroundColor: isGenerating ? '#555' : '#4a90e2',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: isGenerating ? 'not-allowed' : 'pointer',
                            color: 'white'
                        }}
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? "Preparing Interview..." : "Start Interview"}
                    </button>
                </div>
            </div>
        </div>
    );
}
