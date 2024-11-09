import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, TextField, Card, CardContent, CardActions, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';

const Projects = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [projects, setProjects] = useState([]);
    const [newProjectTitle, setNewProjectTitle] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects');
                setProjects(response.data);
            } catch (error) {
                console.error("Erro ao buscar projetos:", error);
            }
        };

        fetchProjects();
    }, []);

    const handleCreateProject = async () => {
        try {
            const response = await api.post('/projects', {
                title: newProjectTitle,
                description: newProjectDescription,
            });
            setProjects([...projects, response.data]);
            setNewProjectTitle('');
            setNewProjectDescription('');
            enqueueSnackbar('Projeto criado com sucesso!', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Erro ao criar projeto', { variant: 'error' });
            console.error("Erro ao criar projeto:", error);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await api.delete(`/projects/${projectId}`);
            setProjects(projects.filter((project) => project._id !== projectId));
            enqueueSnackbar('Projeto excluído com sucesso!', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Erro ao excluir projeto', { variant: 'error' });
            console.error("Erro ao excluir projeto:", error);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom style={{ marginTop: '20px' }}>
                Projetos
            </Typography>

            <Card variant="outlined" style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h6" gutterBottom>
                    Criar Novo Projeto
                </Typography>
                <TextField
                    label="Título do projeto"
                    variant="outlined"
                    fullWidth
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
                <TextField
                    label="Descrição do projeto"
                    variant="outlined"
                    fullWidth
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />
                <Button variant="contained" color="primary" onClick={handleCreateProject}>
                    Criar Projeto
                </Button>
            </Card>

            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{project.title}</Typography>
                                <Typography color="textSecondary">{project.description}</Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" component={Link} to={`/projects/${project._id}/tasks`}>
                                    Ver Tarefas
                                </Button>
                                <Button size="small" color="secondary" onClick={() => handleDeleteProject(project._id)}>
                                    Excluir
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Projects;
