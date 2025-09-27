import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fileToBase64, XIcon, ImageIcon } from '../constants';

export const PostForm: React.FC<{ privateTeamId?: string }> = ({ privateTeamId }) => {
    const [content, setContent] = useState('');
    const [imageDataUrl, setImageDataUrl] = useState('');
    const { currentUser, addPost } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const isPlusMember = currentUser?.role.includes('_plus') || currentUser?.role === 'admin';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            addPost(content, imageDataUrl, privateTeamId);
            setContent('');
            setImageDataUrl('');
        }
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setImageDataUrl(base64);
        }
    };
    
    const placeholderText = privateTeamId ? "Post an announcement to your team..." : "What's on your mind?";
    
    const isTimedOut = currentUser?.timeoutUntil && new Date(currentUser.timeoutUntil) > new Date();
    const timeoutExpiry = isTimedOut ? new Date(currentUser.timeoutUntil!).toLocaleString() : '';

    if (isTimedOut) {
        return (
            <div className="bg-red-900/50 border border-red-500/50 p-4 rounded-lg text-center">
                <p className="font-bold text-red-400">You are currently timed out.</p>
                <p className="text-sm text-red-400/80">You cannot post or comment until {timeoutExpiry}.</p>
            </div>
        )
    }

    return (
        <div className="bg-brand-surface p-4 rounded-lg shadow-md mb-8 border border-brand-border/50">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="w-full bg-black/30 text-brand-text border border-brand-border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-shadow placeholder-brand-text-muted/50"
                    rows={4}
                    placeholder={placeholderText}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                 {isPlusMember && (
                    <div className="mt-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                        />
                        {!imageDataUrl ? (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 bg-black/30 text-brand-text-muted border border-brand-border rounded-md p-3 hover:bg-brand-border/50 transition-colors"
                            >
                                <ImageIcon className="w-5 h-5" />
                                <span>Upload Image (Plus Feature)</span>
                            </button>
                        ) : (
                            <div className="relative">
                                <img src={imageDataUrl} alt="Preview" className="w-full h-auto max-h-72 object-cover rounded-md" />
                                <button
                                    type="button"
                                    onClick={() => setImageDataUrl('')}
                                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5 text-white hover:bg-black/80"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex justify-end mt-3">
                    <button
                        type="submit"
                        disabled={!content.trim()}
                        className="bg-brand-interactive hover:bg-green-500 text-black font-bold py-2 px-6 rounded-md transition-all disabled:bg-brand-border disabled:text-brand-accent/50 disabled:cursor-not-allowed"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
};