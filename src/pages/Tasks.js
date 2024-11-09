import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

const Tasks = () => {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.get(`/projects/${projectId}/tasks`);
                setTasks(response.data);
            } catch (error) {
                console.error("Erro ao buscar tarefas:", error);
            }
        };

        fetchTasks();
    }, [projectId]);

    const handleAddTask = async () => {
        try {
            const response = await api.post(`/projects/${projectId}/tasks`, {
                title: newTaskTitle,
                description: newTaskDescription,
            });
            setTasks([...tasks, response.data]);
            setNewTaskTitle('');
            setNewTaskDescription('');
        } catch (error) {
            console.error("Erro ao adicionar tarefa:", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await api.delete(`/projects/${projectId}/tasks/${taskId}`);
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (error) {
            console.error("Erro ao excluir tarefa:", error);
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setNewTaskTitle(task.title);
        setNewTaskDescription(task.description);
    };

    const handleUpdateTask = async () => {
        try {
            const response = await api.put(`/projects/${projectId}/tasks/${editingTask._id}`, {
                title: newTaskTitle,
                description: newTaskDescription,
            });
            setTasks(tasks.map((task) => (task._id === editingTask._id ? response.data : task)));
            setEditingTask(null);
            setNewTaskTitle('');
            setNewTaskDescription('');
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
        }
    };

    return (
        <div>
            <h1>Tarefas do Projeto</h1>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <button onClick={() => handleEditTask(task)}>Editar</button>
                        <button onClick={() => handleDeleteTask(task._id)}>Excluir</button>
                    </li>
                ))}
            </ul>
            <div>
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Título da tarefa"
                />
                <input
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Descrição da tarefa"
                />
                {editingTask ? (
                    <button onClick={handleUpdateTask}>Atualizar Tarefa</button>
                ) : (
                    <button onClick={handleAddTask}>Adicionar Tarefa</button>
                )}
            </div>
        </div>
    );
};

export default Tasks;
