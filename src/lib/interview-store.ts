import { create } from "zustand";

interface InterviewState {
    resumeText: string;
    jobDescription: string;
    generatedQuestions: string[];
    isGenerating: boolean;
    setResumeText: (text: string) => void;
    setJobDescription: (text: string) => void;
    setGeneratedQuestions: (questions: string[]) => void;
    setIsGenerating: (isGenerating: boolean) => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
    resumeText: "",
    jobDescription: "",
    generatedQuestions: [],
    isGenerating: false,
    setResumeText: (text) => set({ resumeText: text }),
    setJobDescription: (text) => set({ jobDescription: text }),
    setGeneratedQuestions: (questions) => set({ generatedQuestions: questions }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
}));
