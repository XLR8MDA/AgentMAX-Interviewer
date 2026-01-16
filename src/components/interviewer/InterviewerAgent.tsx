import { useEffect, memo } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { useInterviewStore } from "../../lib/interview-store";
import { Modality } from "@google/genai";

function InterviewerAgentComponent() {
    const { setConfig, setModel } = useLiveAPIContext();
    const { generatedQuestions, jobDescription } = useInterviewStore();

    useEffect(() => {
        setModel("models/gemini-2.0-flash-exp");

        const questionsList = generatedQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n");

        const systemInstructionText = `
      You are Clofii (Candidate Level Optimization & Flow-based Interactive Interviewer), a professional, friendly, and thorough HR Interviewer.
      You are interviewing a candidate for a role described as:
      ${jobDescription}

      Your goal is to assess the candidate's fit for this role.
      You have prepared the following questions to guide the interview, but you should also ask follow-up questions based on their responses:
      
      ${questionsList}

      INSTRUCTIONS:
      1. Start by welcoming the candidate and asking them to briefly introduce themselves.
      2. Proceed through the questions naturally. Do not just read them as a list. Connect them to the candidate's previous answers if possible.
      3. If a candidate gives a vague answer, ask for specific examples or clarification.
      4. Be encouraging but professional.
      5. Once all questions are covered or the time is up, thank the candidate and end the interview.

      Keep your responses concise and conversational, suitable for a voice interface.
    `;

        setConfig({
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
            },
            systemInstruction: {
                parts: [
                    {
                        text: systemInstructionText,
                    },
                ],
            },
            tools: [
                { googleSearch: {} },
            ],
        });
    }, [setConfig, setModel, generatedQuestions, jobDescription]);

    return (
        <div className="interviewer-agent" style={{ padding: '20px', color: '#ccc', maxHeight: '400px', overflowY: 'auto' }}>
            <h3>Interview Plan</h3>
            <p><strong>Role:</strong> {jobDescription ? "Context Loaded" : "No Context"}</p>
            {generatedQuestions.length > 0 ? (
                <ul>
                    {generatedQuestions.map((q, i) => (
                        <li key={i} style={{ marginBottom: '10px' }}>{q}</li>
                    ))}
                </ul>
            ) : (
                <p>No questions generated. Please go back to setup.</p>
            )}
        </div>
    );
}

export const InterviewerAgent = memo(InterviewerAgentComponent);
