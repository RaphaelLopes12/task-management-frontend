import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Box } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../services/api';

const CommentsSection = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await api.get(`/tasks/${taskId}/comments`);
                setComments(response.data || []);
            } catch (error) {
                console.error("Erro ao buscar comentários:", error);
            }
        };

        fetchComments();
    }, [taskId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            const response = await api.post(`/tasks/${taskId}/comments`, { text: newComment });
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error("Erro ao adicionar comentário:", error);
        }
    };

    const handleEditComment = (comment) => {
        setEditingCommentId(comment._id);
        setEditingCommentText(comment.text);
    };

    const handleUpdateComment = async () => {
        try {
            const response = await api.put(`/tasks/${taskId}/comments/${editingCommentId}`, { text: editingCommentText });

            setComments(comments.map((comment) =>
                comment._id === editingCommentId ? response.data.comment : comment
            ));

            setEditingCommentId(null);
            setEditingCommentText('');
        } catch (error) {
            console.error("Erro ao atualizar comentário:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/tasks/${taskId}/comments/${commentId}`);
            setComments(comments.filter((comment) => comment._id !== commentId));
        } catch (error) {
            console.error("Erro ao excluir comentário:", error);
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Comentários
            </Typography>

            <List>
                {comments.map((comment) => (
                    <ListItem key={comment._id} alignItems="flex-start">
                        <ListItemText
                            primary={
                                <Typography variant="body1" color="textPrimary">
                                    {comment.user?.name || "Usuário desconhecido"}
                                </Typography>
                            }
                            secondary={
                                <>
                                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                                        {comment.text || "Comentário vazio"}
                                    </Typography>
                                    {comment.createdAt && (
                                        <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginTop: '4px' }}>
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </Typography>
                                    )}
                                </>
                            }
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="editar" onClick={() => handleEditComment(comment)}>
                                <Edit />
                            </IconButton>
                            <IconButton edge="end" aria-label="excluir" onClick={() => handleDeleteComment(comment._id)}>
                                <Delete />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>

            {/* Campo para adicionar novo comentário */}
            <Box mt={2}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Adicionar comentário"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAddComment} style={{ marginTop: '10px' }}>
                    Comentar
                </Button>
            </Box>

            {/* Campo para editar comentário existente */}
            {editingCommentId && (
                <Box mt={2}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Editar comentário"
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={handleUpdateComment} style={{ marginTop: '10px' }}>
                        Salvar
                    </Button>
                    <Button variant="text" color="secondary" onClick={() => setEditingCommentId(null)} style={{ marginTop: '10px', marginLeft: '10px' }}>
                        Cancelar
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default CommentsSection;
