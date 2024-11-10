import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:5000");

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const handleNewTask = (data) => setNotifications((prev) => [...prev, data]);
        const handleNewComment = (data) => setNotifications((prev) => [...prev, data]);
        const handleEditComment = (data) => setNotifications((prev) => [...prev, data]);
        const handleDeleteComment = (data) => setNotifications((prev) => [...prev, data]);
        const handleNewCollaborator = (data) => setNotifications((prev) => [...prev, data]);
        const handleRemoveCollaborator = (data) => setNotifications((prev) => [...prev, data]);

        socket.on("newTask", handleNewTask);
        socket.on("newComment", handleNewComment);
        socket.on("editComment", handleEditComment);
        socket.on("deleteComment", handleDeleteComment);
        socket.on("newCollaborator", handleNewCollaborator);
        socket.on("removeCollaborator", handleRemoveCollaborator);

        return () => {
            socket.off("newTask", handleNewTask);
            socket.off("newComment", handleNewComment);
            socket.off("editComment", handleEditComment);
            socket.off("deleteComment", handleDeleteComment);
            socket.off("newCollaborator", handleNewCollaborator);
            socket.off("removeCollaborator", handleRemoveCollaborator);
        };
    }, []);

    const removeNotification = (index) => {
        setNotifications((prev) => prev.filter((_, i) => i !== index));
    };

    return { notifications, removeNotification };
};

export default useNotifications;
