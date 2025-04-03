import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; 

const NoticeDisplay = () => {
    const [notices, setNotices] = useState([]);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
                const response = await axios.get('/api/user/notices', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNotices(response.data);
            } catch (error) {
                console.error('Error fetching notices:', error);
            }
        };

        fetchNotices();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/resource/notices/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Notice deleted successfully');
            setNotices(notices.filter((notice) => notice._id !== id)); // Remove the deleted notice from the list
        } catch (error) {
            console.error('Error deleting notice:', error);
            alert('Failed to delete notice');
        }
    };

    return (
        <div>
            <div className="container mx-auto px-12 py-8">
                <ul className="space-y-4">
                    <h1 className="text-2xl font-bold mb-4 text-center">Notices</h1>
                    {notices.map((notice) => (
                        <li key={notice._id}>
                            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                                <br />
                                <h2 className="font-bold">Title: {notice.title}</h2>
                                <p>{notice.content}</p>
                                <small>Created At: {new Date(notice.createdAt).toLocaleString()}</small>
                                <br />
                               {/* Show delete button only if the user is Resource Admin or Super Admin */}
                                {(currentUser?.role === 'Super Admin' || currentUser?.role === 'Resource Admin') && (
                                    <button
                                        onClick={() => handleDelete(notice._id)}
                                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default NoticeDisplay;