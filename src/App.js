import React from 'react';
import Notifications from './components/Notifications';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import TasksBoard from './pages/TasksBoard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <AuthProvider>
        <Router>
          <Notifications />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId/tasks" element={<TasksBoard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
