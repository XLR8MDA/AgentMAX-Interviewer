import React, { useCallback, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import mammoth from "mammoth";
import { useInterviewStore } from "../lib/interview-store";

// Set worker path for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const FileUploader: React.FC = () => {
    const { setResumeText } = useInterviewStore();
    const [fileName, setFileName] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const extractTextFromPdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(" ");
            fullText += pageText + "\n";
        }
        return fullText;
    };

    const extractTextFromDocx = async (arrayBuffer: ArrayBuffer): Promise<string> => {
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    };

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsProcessing(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            let extractedText = "";

            if (file.type === "application/pdf") {
                extractedText = await extractTextFromPdf(arrayBuffer);
            } else if (
                file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                file.name.endsWith(".docx")
            ) {
                extractedText = await extractTextFromDocx(arrayBuffer);
            } else {
                throw new Error("Unsupported file type. Please upload a PDF or Word (.docx) file.");
            }

            if (!extractedText.trim()) {
                throw new Error("Could not extract text from the file. It might be empty or scanned.");
            }

            setResumeText(extractedText);
        } catch (err: any) {
            console.error("Error extracting text:", err);
            setError(err.message || "Failed to process the file.");
            setFileName(null);
        } finally {
            setIsProcessing(false);
        }
    }, [setResumeText]);

    return (
        <div style={{
            border: '2px dashed var(--gray-600)',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: 'var(--Neutral-10)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-family)'
        }}
            onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--Blue-500)';
                e.currentTarget.style.backgroundColor = 'var(--Neutral-15)';
            }}
            onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--gray-600)';
                e.currentTarget.style.backgroundColor = 'var(--Neutral-10)';
            }}
            onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = 'var(--gray-600)';
                e.currentTarget.style.backgroundColor = 'var(--Neutral-10)';
                const file = e.dataTransfer.files?.[0];
                if (file) {
                    const target = { files: e.dataTransfer.files } as any;
                    handleFileChange({ target } as any);
                }
            }}
            onClick={() => document.getElementById('file-upload-input')?.click()}
        >
            <input
                id="file-upload-input"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <div style={{ color: 'var(--gray-300)' }}>
                {isProcessing ? (
                    <p style={{ color: 'var(--Blue-400)', fontWeight: 'bold' }}>Processing file...</p>
                ) : fileName ? (
                    <div>
                        <p style={{ color: 'var(--Blue-500)', fontWeight: 'bold', fontSize: '1.1rem' }}>{fileName}</p>
                        <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Click or drag to change</p>
                    </div>
                ) : (
                    <div>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--gray-500)' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 'inherit' }}>cloud_upload</span>
                        </div>
                        <p style={{ fontSize: '1.1rem', color: 'var(--text)', fontWeight: 'bold', marginBottom: '0.5rem' }}>Upload Resume</p>
                        <p style={{ fontSize: '0.8rem' }}>PDF or Word (.docx) files only</p>
                    </div>
                )}
            </div>
            {error && <p style={{ color: 'var(--Red-400)', marginTop: '10px', fontSize: '0.9rem' }}>{error}</p>}
        </div>
    );
};
