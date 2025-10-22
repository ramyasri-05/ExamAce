
import React from 'react';
import Button from './common/Button.tsx';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon.tsx';
import { GoogleIcon } from './icons/GoogleIcon.tsx';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                 <div className="flex items-center justify-center mb-8">
                     <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
                        <BrainCircuitIcon className="w-10 h-10 text-white" />
                     </div>
                     <div className="ml-4">
                        <h1 className="text-3xl font-bold text-gray-800">ExamAce</h1>
                        <p className="text-sm text-gray-500">Your AI Coach</p>
                     </div>
                 </div>

                <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200/80">
                    <h2 className="text-2xl font-semibold text-center text-gray-700 mb-1">Welcome Back!</h2>
                    <p className="text-center text-gray-500 mb-6">Sign in to continue your journey.</p>
                    
                    <form onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                        <div className="space-y-5">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    defaultValue="ramya@example.com"
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    defaultValue="password"
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                             <Button type="submit" variant="gradient" size="lg" className="w-full">
                                Login
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={onLogin}
                            className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <GoogleIcon className="w-5 h-5 mr-3" />
                            Continue with Google
                        </button>
                    </div>
                </div>
                 <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                        Sign up now
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;