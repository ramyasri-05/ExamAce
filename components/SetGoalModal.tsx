
import React, { useState } from 'react';
import Button from './common/Button.tsx';
import Card from './common/Card.tsx';
import { XIcon } from './icons/XIcon.tsx';
import { TargetIcon } from './icons/TargetIcon.tsx';

interface SetGoalModalProps {
    currentGoal: number;
    onClose: () => void;
    onSave: (newGoal: number) => void;
}

const SetGoalModal: React.FC<SetGoalModalProps> = ({ currentGoal, onClose, onSave }) => {
    const [goal, setGoal] = useState(currentGoal.toString());

    const handleSave = () => {
        const newGoal = parseInt(goal, 10);
        if (!isNaN(newGoal) && newGoal > 0) {
            onSave(newGoal);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <TargetIcon className="w-6 h-6 mr-2 text-purple-600" />
                        <h2 className="text-xl font-semibold">Set Your Daily Goal</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <p className="text-gray-600 mb-4">Set a daily study goal to stay motivated and track your progress. How many minutes do you want to study each day?</p>
                <div>
                    <label htmlFor="goal-input" className="block text-sm font-medium text-gray-700">
                        Study minutes per day
                    </label>
                    <input
                        id="goal-input"
                        type="number"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition bg-white"
                        placeholder="e.g., 120"
                    />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Goal</Button>
                </div>
            </Card>
        </div>
    );
};

export default SetGoalModal;