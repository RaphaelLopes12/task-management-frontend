import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Paper, TextField, Button, Modal, Box, Select, MenuItem } from '@mui/material';
import CommentsSection from './CommentsSection';

const TasksBoard = () => {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState({ pending: [], inProgress: [], done: [] });
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('Pendente');
    const [editingTask, setEditingTask] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await api.get(`/projects/${projectId}/tasks`);

                const categorizedTasks = {
                    pending: [],
                    inProgress: [],
                    done: [],
                };

                response.data.forEach(task => {
                    if (task.status === 'Pendente') categorizedTasks.pending.push(task);
                    else if (task.status === 'Em andamento') categorizedTasks.inProgress.push(task);
                    else if (task.status === 'Concluída') categorizedTasks.done.push(task);
                });

                console.log("Tarefas categorizadas:", categorizedTasks);

                setTasks(categorizedTasks);
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
                status: newTaskStatus,
            });
            setTasks(prevTasks => ({
                ...prevTasks,
                [newTaskStatus === 'Pendente' ? 'pending' : newTaskStatus === 'Em andamento' ? 'inProgress' : 'done']: [
                    ...prevTasks[newTaskStatus === 'Pendente' ? 'pending' : newTaskStatus === 'Em andamento' ? 'inProgress' : 'done'],
                    response.data,
                ],
            }));
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskStatus('Pendente');
            setAddModalOpen(false);
        } catch (error) {
            console.error("Erro ao adicionar tarefa:", error);
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setModalOpen(true);
    };

    const handleUpdateTask = async () => {
        try {
            const response = await api.put(`/projects/${projectId}/tasks/${editingTask._id}`, {
                title: editingTask.title,
                description: editingTask.description,
                status: editingTask.status,
            });
            setTasks(prevTasks => {
                const updatedTasks = { ...prevTasks };
                Object.keys(updatedTasks).forEach(key => {
                    updatedTasks[key] = updatedTasks[key].filter(task => task._id !== editingTask._id);
                });
                updatedTasks[editingTask.status === 'Pendente' ? 'pending' : editingTask.status === 'Em andamento' ? 'inProgress' : 'done'] = [
                    ...updatedTasks[editingTask.status === 'Pendente' ? 'pending' : editingTask.status === 'Em andamento' ? 'inProgress' : 'done'],
                    response.data,
                ];
                return updatedTasks;
            });
            setModalOpen(false);
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
        }
    };

    const handleDeleteTask = async (taskId, status) => {
        try {
            await api.delete(`/projects/${projectId}/tasks/${taskId}`);
            setTasks(prevTasks => ({
                ...prevTasks,
                [status === 'Pendente' ? 'pending' : status === 'Em andamento' ? 'inProgress' : 'done']: prevTasks[status === 'Pendente' ? 'pending' : status === 'Em andamento' ? 'inProgress' : 'done'].filter(task => task._id !== taskId),
            }));
        } catch (error) {
            console.error("Erro ao excluir tarefa:", error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom style={{ marginTop: '20px', textAlign: 'center' }}>
                Board de Tarefas
            </Typography>
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {['pending', 'inProgress', 'done'].map((status) => (
                    <Grid item xs={12} md={4} key={status}>
                        <Paper elevation={3} style={{ padding: '10px' }}>
                            <Typography variant="h6">
                                {status === 'pending' ? 'Pendente' : status === 'inProgress' ? 'Em andamento' : 'Concluída'}
                            </Typography>
                            {tasks[status].map(task => (
                                <Paper key={task._id} style={{ margin: '10px 0', padding: '10px' }}>
                                    <Typography variant="subtitle1">{task.title}</Typography>
                                    <Typography color="textSecondary">{task.description}</Typography>
                                    <Button color="primary" size="small" onClick={() => handleEditTask(task)}>
                                        Editar
                                    </Button>
                                    <Button color="secondary" size="small" onClick={() => handleDeleteTask(task._id, task.status)}>
                                        Excluir
                                    </Button>

                                    <CommentsSection taskId={task._id} />
                                </Paper>
                            ))}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Botão para abrir o modal de adição */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button variant="contained" color="primary" onClick={() => setAddModalOpen(true)}>
                    Adicionar Tarefa
                </Button>
            </div>

            {/* Modal de Adição de Tarefa */}
            <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
                <Box sx={{ padding: 4, backgroundColor: 'white', maxWidth: 400, margin: 'auto', marginTop: '10%' }}>
                    <Typography variant="h6">Adicionar Nova Tarefa</Typography>
                    <TextField
                        label="Título da Tarefa"
                        variant="outlined"
                        fullWidth
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        style={{ marginTop: '10px' }}
                    />
                    <TextField
                        label="Descrição da Tarefa"
                        variant="outlined"
                        fullWidth
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                        style={{ marginTop: '10px' }}
                    />
                    <Select
                        label="Status Inicial"
                        variant="outlined"
                        fullWidth
                        value={newTaskStatus}
                        onChange={(e) => setNewTaskStatus(e.target.value)}
                        style={{ marginTop: '10px' }}
                    >
                        <MenuItem value="todo">A Fazer</MenuItem>
                        <MenuItem value="inProgress">Em Progresso</MenuItem>
                    </Select>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddTask}
                        style={{ marginTop: '20px' }}
                    >
                        Adicionar Tarefa
                    </Button>
                </Box>
            </Modal>

            {/* Modal de Edição de Tarefa */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={{ padding: 4, backgroundColor: 'white', maxWidth: 400, margin: 'auto', marginTop: '10%' }}>
                    <Typography variant="h6">Editar Tarefa</Typography>
                    <TextField
                        label="Título"
                        variant="outlined"
                        fullWidth
                        value={editingTask?.title || ''}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        style={{ marginTop: '10px' }}
                    />
                    <TextField
                        label="Descrição"
                        variant="outlined"
                        fullWidth
                        value={editingTask?.description || ''}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                        style={{ marginTop: '10px' }}
                    />
                    <Select
                        label="Status"
                        variant="outlined"
                        fullWidth
                        value={editingTask?.status || ''}
                        onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                        style={{ marginTop: '10px' }}
                    >
                        <MenuItem value="Pendente">Pendente</MenuItem>
                        <MenuItem value="Em andamento">Em andamento</MenuItem>
                        <MenuItem value="Concluída">Concluída</MenuItem>
                    </Select>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdateTask}
                        style={{ marginTop: '20px' }}
                    >
                        Salvar Alterações
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
};

export default TasksBoard;
