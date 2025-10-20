import React from 'react';

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizResult {
  date: string;
  score: number;
  subject: string;
  topic: string;
  totalQuestions: number;
}

export interface User {
  name: string;
  email: string;
  studyStreak: number;
  points: number;
  quizzesCompleted: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  description: string;
  topics: {
    id: string;
    name: string;
    mastery: number; // 0-100
  }[];
}

export interface StudyPlanItem {
    id: string;
    date: Date;
    subject: string;
    topic: string;
    status: 'completed' | 'upcoming' | 'missed';
    duration: number; // in minutes
}
