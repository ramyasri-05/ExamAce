import React from 'react';
import { User } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { UserIcon } from './icons/UserIcon';
import { LogOutIcon } from './icons/LogOutIcon';

// Mock data
const mockUser: User = {
    name: "Ramya",
    email: "ramya@example.com",
    studyStreak: 0,
    points: 0,
    quizzesCompleted: 0,
};

interface ProfileProps {
    onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
    const user = mockUser;
    
    return (
        <div className="max-w-2xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
                <p className="text-gray-500 mt-1">Manage your account information and preferences.</p>
            </header>
            
            <Card>
                <div className="flex items-center space-x-6 mb-8">
                    <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center">
                         <div className="w-20 h-20 bg-violet-300 rounded-full flex items-center justify-center font-bold text-violet-700 text-4xl">
                            R
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>

                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="text"
                                name="name"
                                value={user.name}
                                readOnly
                                className="focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                readOnly
                                className="focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-100"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200/80 flex justify-end">
                     <Button variant="secondary" onClick={onLogout}>
                        <LogOutIcon className="w-5 h-5 mr-2" />
                        Logout
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default Profile;
