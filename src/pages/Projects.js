import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [editingProject, setEditingProject] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
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

    const handleEditProject = (project) => {
        setEditingProject(project);
        setNewTitle(project.title);
        setNewDescription(project.description);
    };

    const handleUpdateProject = async () => {
        try {
            const response = await api.put(`/projects/${editingProject._id}`, {
                title: newTitle,
                description: newDescription,
            });
            setProjects(
                projects.map((project) =>
                    project._id === editingProject._id ? response.data : project
                )
            );
            setEditingProject(null);
            setNewTitle('');
            setNewDescription('');
        } catch (error) {
            console.error("Erro ao atualizar projeto:", error);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await api.delete(`/projects/${projectId}`);
            setProjects(projects.filter((project) => project._id !== projectId));
        } catch (error) {
            console.error("Erro ao excluir projeto:", error);
        }
    };

    const handleAddCollaborator = async (projectId) => {
        try {
            await api.post(`/projects/${projectId}/collaborators`, {
                collaboratorEmail,
            });
            alert("Colaborador adicionado com sucesso!");
            setCollaboratorEmail('');
        } catch (error) {
            console.error("Erro ao adicionar colaborador:", error);
        }
    };

    const handleRemoveCollaborator = async (projectId, collaboratorId) => {
        try {
            await api.delete(`/projects/${projectId}/collaborators`, {
                data: { collaboratorId },
            });
            alert("Colaborador removido com sucesso!");
        } catch (error) {
            console.error("Erro ao remover colaborador:", error);
        }
    };

    const handleCreateProject = async () => {
        try {
            const response = await api.post('/projects', {
                title: newProjectTitle,
                description: newProjectDescription,
            });
            setProjects([...projects, response.data]);
            setNewProjectTitle('');
            setNewProjectDescription('');
        } catch (error) {
            console.error("Erro ao criar projeto:", error);
        }
    };

    return (
        <div>
            <h1>Projetos</h1>

            {/* Formulário de criação de novo projeto */}
            <div>
                <h2>Criar Novo Projeto</h2>
                <input
                    type="text"
                    placeholder="Título do projeto"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Descrição do projeto"
                    value={newProjectDescription}
                    onChange={(e) => setNewProjectDescription(e.target.value)}
                />
                <button onClick={handleCreateProject}>Criar Projeto</button>
            </div>

            <ul>
                {projects.map((project) => (
                    <li key={project._id}>
                        <h3>
                            <Link to={`/projects/${project._id}/tasks`}>{project.title}</Link>
                        </h3>
                        <p>{project.description}</p>
                        <button onClick={() => handleEditProject(project)}>Editar</button>
                        <button onClick={() => handleDeleteProject(project._id)}>Excluir</button>
                        <div>
                            <h4>Colaboradores</h4>
                            <ul>
                                {project.collaborators.map((collaborator) => (
                                    <li key={collaborator._id}>
                                        {collaborator.email}
                                        <button onClick={() => handleRemoveCollaborator(project._id, collaborator._id)}>
                                            Remover
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <input
                                type="email"
                                placeholder="Email do colaborador"
                                value={collaboratorEmail}
                                onChange={(e) => setCollaboratorEmail(e.target.value)}
                            />
                            <button onClick={() => handleAddCollaborator(project._id)}>
                                Adicionar Colaborador
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {editingProject && (
                <div>
                    <h2>Editando Projeto</h2>
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Título do projeto"
                    />
                    <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Descrição do projeto"
                    />
                    <button onClick={handleUpdateProject}>Atualizar Projeto</button>
                </div>
            )}
        </div>
    );
};

export default Projects;
