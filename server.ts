import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, Modality } from '@google/genai';

dotenv.config({ path: '.env.local' });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in the environment variables');
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Endpoint to generate a quiz
app.post('/api/generate-quiz', async (req, res) => {
    const { concept, numQuestions } = req.body;
    if (!concept || !numQuestions) {
        return res.status(400).json({ error: 'Missing concept or numQuestions' });
    }

    const quizGenerationSchema = {
        type: Type.OBJECT,
        properties: {
            questions: {
                type: Type.ARRAY,
                description: 'An array of quiz questions.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING, description: 'The question text.' },
                        options: {
                            type: Type.ARRAY,
                            description: 'An array of 4 multiple-choice options.',
                            items: { type: Type.STRING }
                        },
                        correctAnswer: { type: Type.STRING, description: 'The correct answer from the options.' }
                    },
                    required: ['question', 'options', 'correctAnswer']
                }
            }
        },
        required: ['questions']
    };

    try {
        const prompt = `Generate a ${numQuestions}-question multiple-choice quiz about the concept: "${concept}". Each question should have exactly 4 options. Provide the response as a JSON object with a single key "questions", which is an array of question objects. Each question object must have "question", "options" (an array of 4 strings), and "correctAnswer" keys. The "correctAnswer" must be one of the strings from the "options" array.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: quizGenerationSchema,
            }
        });
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        res.json(result);
    } catch (error) {
        console.error('Error generating quiz with Gemini API:', error);
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
});

// Endpoint to generate an explanation
app.post('/api/generate-explanation', async (req, res) => {
    const { topic } = req.body;
    if (!topic) {
        return res.status(400).json({ error: 'Missing topic' });
    }

    try {
        const prompt = `Explain the concept of "${topic}" in detail. The explanation should be clear, comprehensive, and suitable for a student preparing for competitive exams. Use Markdown for formatting. Structure the content with headings, subheadings, bullet points, and bold text for key terms. If a diagram, image, or chart would be helpful to illustrate a point, describe it within a placeholder like this: [Image: A detailed description of the image or diagram].`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        res.json({ explanation: response.text.trim() });
    } catch (error) {
        console.error('Error generating concept explanation with Gemini API:', error);
        res.status(500).json({ error: 'Failed to generate an explanation for this topic. Please try again.' });
    }
});

// Endpoint to generate focus items
app.post('/api/generate-focus-items', async (req, res) => {
    const { history } = req.body;
    if (!history) {
        return res.status(400).json({ error: 'Missing history' });
    }

    const focusItemsSchema = {
        type: Type.OBJECT,
        properties: {
            focusItems: {
                type: Type.ARRAY,
                description: 'An array of 3 actionable focus items.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        text: { type: Type.STRING, description: 'The actionable task for the student.' },
                        priority: {
                            type: Type.STRING,
                            description: "The priority of the task: 'high', 'medium', or 'critical'."
                        }
                    },
                    required: ['text', 'priority']
                }
            }
        },
        required: ['focusItems']
    };

    try {
        const prompt = `Based on this student's recent quiz history, identify their top weak areas or topics. Generate a list of exactly 3 actionable focus items for today to help them improve. The items should be concise and direct. The priority should reflect the urgency based on low scores. Respond in JSON format. The JSON object should have a single key "focusItems", containing an array of 3 objects. Each object must have a "text" key (a string) and a "priority" key (a string: 'high', 'medium', or 'critical'). Student's Quiz History: ${JSON.stringify(history.slice(-10))}`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: focusItemsSchema,
            }
        });
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        res.json(result);
    } catch (error) {
        console.error('Error generating focus items with Gemini API:', error);
        res.status(500).json({
            focusItems: [
                { text: 'Review past quizzes to identify weak spots', priority: 'high' },
                { text: 'Take a new practice quiz', priority: 'medium' },
                { text: 'Plan your study schedule for the week', priority: 'medium' },
            ]
        });
    }
});

// NOTE: Chat and Image generation are more complex and will be handled in a future step if requested.

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
