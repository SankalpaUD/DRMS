import React, { useState } from 'react';
import axios from 'axios';

const NoticeUpload = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

            await axios.post('/api/resource/notices', { title, content }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Notice uploaded successfully');
            setTitle('');
            setContent('');
        } catch (error) {
            console.error('Error uploading notice:', error);
            alert('Failed to upload notice');
        }
    };

    return (
       
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-black mb-6">Upload Notice</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Enter notice title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content
                        </label>
                        <textarea
                            id="content"
                            placeholder="Enter notice content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows="5"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Upload Notice
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NoticeUpload;