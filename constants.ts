import { DumbbellIcon } from './components/icons/DumbbellIcon';
import { BookOpenIcon } from './components/icons/BookOpenIcon';
import { TargetIcon } from './components/icons/TargetIcon';
import { BarChartIcon } from './components/icons/BarChartIcon';
import { BrainCircuitIcon } from './components/icons/BrainCircuitIcon';
import { AwardIcon } from './components/icons/AwardIcon';
import { ListIcon } from './components/icons/ListIcon';
import { ScaleIcon } from './components/icons/ScaleIcon';
import { GraduationCapIcon } from './components/icons/GraduationCapIcon';
import { Subject, QuizResult, StudyPlanItem } from './types';

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: DumbbellIcon,
    description: 'Master concepts from algebra to calculus.',
    topics: [
      { id: 'algebra', name: 'Algebra', mastery: 85 },
      { id: 'calculus', name: 'Calculus', mastery: 60 },
      { id: 'statistics', name: 'Statistics', mastery: 75 },
    ],
  },
  {
    id: 'quant',
    name: 'Quantitative Aptitude',
    icon: BarChartIcon,
    description: 'Sharpen your numerical and problem-solving skills.',
    topics: [
      { id: 'percentage', name: 'Percentage', mastery: 70 },
      { id: 'profit-loss', name: 'Profit & Loss', mastery: 65 },
      { id: 'time-work', name: 'Time & Work', mastery: 80 },
    ],
  },
  {
    id: 'reasoning',
    name: 'Logical Reasoning',
    icon: BrainCircuitIcon,
    description: 'Enhance your analytical and critical thinking abilities.',
    topics: [
      { id: 'syllogism', name: 'Syllogism', mastery: 90 },
      { id: 'seating-arrangement', name: 'Seating Arrangement', mastery: 72 },
      { id: 'blood-relations', name: 'Blood Relations', mastery: 85 },
    ],
  },
  {
    id: 'english',
    name: 'English Language',
    icon: ListIcon,
    description: 'Improve your grammar, vocabulary, and comprehension.',
    topics: [
      { id: 'reading-comprehension', name: 'Reading Comprehension', mastery: 88 },
      { id: 'para-jumbles', name: 'Para Jumbles', mastery: 60 },
      { id: 'error-spotting', name: 'Error Spotting', mastery: 78 },
    ],
  },
  {
    id: 'general-awareness',
    name: 'General Awareness',
    icon: AwardIcon,
    description: 'Stay updated with current affairs and general knowledge.',
    topics: [
      { id: 'current-affairs', name: 'Current Affairs', mastery: 68 },
      { id: 'indian-history', name: 'Indian History', mastery: 75 },
      { id: 'static-gk', name: 'Static GK', mastery: 82 },
    ],
  },
  {
    id: 'polity',
    name: 'Indian Polity & Governance',
    icon: ScaleIcon,
    description: 'Understand the framework of the Indian Constitution and government.',
    topics: [
      { id: 'constitution', name: 'The Indian Constitution', mastery: 0 },
      { id: 'parliament', name: 'Parliament & State Legislature', mastery: 0 },
      { id: 'judiciary', name: 'The Judiciary System', mastery: 0 },
    ],
  },
  {
    id: 'gate',
    name: 'GATE Preparation',
    icon: GraduationCapIcon,
    description: 'Prepare for the Graduate Aptitude Test in Engineering.',
    topics: [
        { id: 'gate-cs', name: 'GATE - Computer Science', mastery: 0 },
        { id: 'gate-me', name: 'GATE - Mechanical Engineering', mastery: 0 },
        { id: 'gate-ce', name: 'GATE - Civil Engineering', mastery: 0 },
        { id: 'gate-ee', name: 'GATE - Electrical Engineering', mastery: 0 },
    ],
  },
  {
    id: 'science',
    name: 'General Science',
    icon: TargetIcon,
    description: 'Understand the world through biology, chemistry, and physics.',
    topics: [
        { id: 'biology', name: 'Biology', mastery: 70 },
        { id: 'chemistry', name: 'Chemistry', mastery: 45 },
        { id: 'physics', name: 'Physics', mastery: 80 },
    ],
  },
];

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const fourDaysAgo = new Date(today);
fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);


export const MOCK_QUIZ_HISTORY: QuizResult[] = [
  { date: new Date('2023-10-01').toISOString(), score: 80, subject: 'Mathematics', topic: 'Algebra', totalQuestions: 10 },
  { date: new Date('2023-10-03').toISOString(), score: 75, subject: 'General Awareness', topic: 'Indian History', totalQuestions: 15 },
  { date: new Date('2023-10-08').toISOString(), score: 85, subject: 'General Science', topic: 'Biology', totalQuestions: 20 },
  { date: new Date('2023-10-10').toISOString(), score: 65, subject: 'English Language', topic: 'Para Jumbles', totalQuestions: 15 },
  { date: new Date('2023-10-15').toISOString(), score: 70, subject: 'Logical Reasoning', topic: 'Seating Arrangement', totalQuestions: 10 },
  { date: new Date('2023-10-16').toISOString(), score: 90, subject: 'Mathematics', topic: 'Statistics', totalQuestions: 10 },
  { date: new Date('2023-10-18').toISOString(), score: 55, subject: 'Quantitative Aptitude', topic: 'Profit & Loss', totalQuestions: 15 },
  { date: fourDaysAgo.toISOString(), score: 88, subject: 'Logical Reasoning', topic: 'Syllogism', totalQuestions: 10 },
  { date: twoDaysAgo.toISOString(), score: 78, subject: 'English Language', topic: 'Error Spotting', totalQuestions: 20 },
  { date: yesterday.toISOString(), score: 68, subject: 'Quantitative Aptitude', topic: 'Percentage', totalQuestions: 15 },
  { date: today.toISOString(), score: 82, subject: 'Mathematics', topic: 'Calculus', totalQuestions: 10 },
];

export const MOCK_STUDY_PLAN: StudyPlanItem[] = [
    { id: '1', date: new Date(Date.now() - 86400000 * 2), subject: 'Mathematics', topic: 'Calculus Derivatives', status: 'completed', duration: 60 },
    { id: '2', date: new Date(), subject: 'History', topic: 'The Cold War - Part 1', status: 'upcoming', duration: 45 },
    { id: '3', date: new Date(Date.now() + 86400000), subject: 'Science', topic: 'Cellular Respiration', status: 'upcoming', duration: 75 },
    { id: '4', date: new Date(Date.now() + 86400000 * 2), subject: 'Mathematics', topic: 'Calculus Integrals', status: 'upcoming', duration: 60 },
];