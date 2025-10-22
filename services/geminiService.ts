
import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
// FIX: Imported QuizResult to be used in the new startChatSession function.
import { Question, QuizResult } from '../types.ts';

console.log("Attempting to use API Key:", process.env.API_KEY);
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
export type { Chat };

const quizGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            description: "An array of quiz questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The question text." },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of 4 multiple-choice options.",
                        items: { type: Type.STRING }
                    },
                    correctAnswer: { type: Type.STRING, description: "The correct answer from the options." }
                },
                required: ["question", "options", "correctAnswer"]
            }
        }
    },
    required: ["questions"]
};

export const generateConceptQuiz = async (concept: string, numQuestions: number): Promise<Question[]> => {
    try {
        const prompt = `Generate a ${numQuestions}-question multiple-choice quiz about the concept: "${concept}". Each question should have exactly 4 options. Provide the response as a JSON object with a single key "questions", which is an array of question objects. Each question object must have "question", "options" (an array of 4 strings), and "correctAnswer" keys. The "correctAnswer" must be one of the strings from the "options" array.`;

        const response = await ai.models.generateContent({
            // FIX: Using a more powerful model for a complex task like quiz generation to ensure higher quality output.
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizGenerationSchema,
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        if (result && Array.isArray(result.questions)) {
            return result.questions.slice(0, numQuestions);
        } else {
            console.error("Unexpected JSON structure from Gemini API:", result);
            return [];
        }
    } catch (error) {
        console.error("Error generating quiz with Gemini API:", error);
        return [];
    }
};

export const generateConceptExplanation = async (topic: string): Promise<string> => {
    try {
        const prompt = `Explain the concept of "${topic}" in detail. The explanation should be clear, comprehensive, and suitable for a student preparing for competitive exams. Use Markdown for formatting. Structure the content with headings, subheadings, bullet points, and bold text for key terms. If a diagram, image, or chart would be helpful to illustrate a point, describe it within a placeholder like this: [Image: A detailed description of the image or diagram].`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating concept explanation with Gemini API:", error);
        throw new Error("Failed to generate an explanation for this topic. Please try again.");
    }
};

export const generateImageFromPrompt = async (prompt: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const { mimeType, data } = part.inlineData;
                return `data:${mimeType};base64,${data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating image with Gemini API:", error);
        return null;
    }
};

const focusItemsSchema = {
    type: Type.OBJECT,
    properties: {
        focusItems: {
            type: Type.ARRAY,
            description: "An array of 3 actionable focus items.",
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING, description: "The actionable task for the student." },
                    priority: { 
                        type: Type.STRING, 
                        description: "The priority of the task: 'high', 'medium', or 'critical'." 
                    }
                },
                required: ["text", "priority"]
            }
        }
    },
    required: ["focusItems"]
};

export const generateFocusItems = async (history: QuizResult[]): Promise<{text: string; priority: string}[]> => {
     try {
        const prompt = `Based on this student's recent quiz history, identify their top weak areas or topics. Generate a list of exactly 3 actionable focus items for today to help them improve. The items should be concise and direct. The priority should reflect the urgency based on low scores. Respond in JSON format. The JSON object should have a single key "focusItems", containing an array of 3 objects. Each object must have a "text" key (a string) and a "priority" key (a string: 'high', 'medium', or 'critical'). Student's Quiz History: ${JSON.stringify(history.slice(-10))}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: focusItemsSchema,
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        if (result && Array.isArray(result.focusItems)) {
            return result.focusItems;
        } else {
            console.error("Unexpected JSON structure for focus items from Gemini API:", result);
            return [];
        }
    } catch (error) {
        console.error("Error generating focus items with Gemini API:", error);
        return [
            { text: 'Review past quizzes to identify weak spots', priority: 'high' },
            { text: 'Take a new practice quiz', priority: 'medium' },
            { text: 'Plan your study schedule for the week', priority: 'medium' },
        ];
    }
}


// FIX: Updated the AI Tutor to use a more capable model and provided specific instructions for generating images.
export const startChatSession = (subject: string, history: QuizResult[]): Chat => {
    const systemInstruction = `You are an expert AI tutor for the subject: ${subject}.
You are helping a student prepare for competitive exams.
Keep your explanations concise, clear, and encouraging.
Use markdown for formatting.
To generate an image to help with an explanation, respond with the text "[generate_image: A detailed prompt for the image]". Do not include this in a code block or surround it with any other text on that line.

The user has the following quiz history:
${JSON.stringify(history.slice(0, 5), null, 2)}
Use this history to understand the user's weak points and tailor your explanations.`;

    const chat = ai.chats.create({
        // FIX: Using a more powerful model to handle complex instructions and function-like behavior.
        model: 'gemini-2.5-pro',
        config: {
            systemInstruction: systemInstruction,
        },
    });
    return chat;
};