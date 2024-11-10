import React from 'react';
import useNotifications from '../hooks/useNotifications';
import { Snackbar, Alert } from '@mui/material';

const Notifications = () => {
    const { notifications, removeNotification } = useNotifications();

    return (
        <>
            {notifications.map((notification, index) => (
                <Snackbar
                    key={index}
                    open={true}
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    onClose={() => removeNotification(index)}
                    style={{ marginBottom: index * 60 }}
                >
                    <Alert severity="info" variant="filled">
                        {notification.message}
                    </Alert>
                </Snackbar>
            ))}
        </>
    );
};

export default Notifications;
