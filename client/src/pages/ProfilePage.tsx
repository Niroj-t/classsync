import { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { token, user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await axios.put('/api/users/change-password', {
        currentPassword,
        newPassword,
      }, {
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={4}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Profile</Typography>
        <Typography variant="h6" gutterBottom>Change Password</Typography>
        <form onSubmit={handleChangePassword}>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default ProfilePage; 