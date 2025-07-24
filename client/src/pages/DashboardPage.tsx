import { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Alert, Button, Stack } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { ListItemSecondaryAction } from '@mui/material';

interface Assignment {
  id: string;
  _id?: string;
  title: string;
  description: string;
  dueDate: string;
  isActive: boolean;
  createdBy?: { name: string; email: string };
}

interface Submission {
  _id: string;
  assignmentId: {
    _id: string;
    title: string;
    dueDate: string;
    maxScore?: number;
  };
  status: string;
  score?: number;
  feedback?: string;
  submittedAt: string;
}

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/assignments', {
          baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignments(res.data.data.assignments || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch assignments');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAssignments();
  }, [token]);

  useEffect(() => {
    if (token && user?.role === 'student') {
      setSubLoading(true);
      setSubError(null);
      axios.get('/api/submissions/my', {
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => setSubmissions(res.data.data.submissions || []))
        .catch(err => setSubError(err.response?.data?.message || 'Failed to fetch submissions'))
        .finally(() => setSubLoading(false));
    }
  }, [token, user]);

  if (!user) return null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Welcome, {user.name}!</Typography>
        <Typography>Email: {user.email}</Typography>
        <Typography>Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Typography>
      </Paper>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          {user.role === 'teacher' ? 'Your Assignments' : 'Available Assignments'}
        </Typography>
        {user.role === 'teacher' && (
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/assignments/new"
          >
            + Create Assignment
          </Button>
        )}
      </Stack>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : assignments.length === 0 ? (
        <Typography>No assignments found.</Typography>
      ) : (
        <List>
          {assignments.map(a => (
            <ListItem key={a._id || a.id} divider>
              <ListItemText
                primary={
                  <Button
                    component={RouterLink}
                    to={`/assignments/${a._id || a.id}`}
                    color="primary"
                    sx={{ textTransform: 'none', pl: 0 }}
                  >
                    {a.title}
                  </Button>
                }
                secondary={`Due: ${new Date(a.dueDate).toLocaleString()}${user.role === 'teacher' && a.createdBy ? ` | Created by: ${a.createdBy.name}` : ''}`}
              />
            </ListItem>
          ))}
        </List>
      )}
      {user.role === 'student' && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>My Submissions</Typography>
          {subLoading ? (
            <CircularProgress />
          ) : subError ? (
            <Alert severity="error">{subError}</Alert>
          ) : submissions.length === 0 ? (
            <Typography>No submissions yet.</Typography>
          ) : (
            <List>
              {submissions.map(s => (
                <ListItem key={s._id} divider>
                  <ListItemText
                    primary={
                      <Button
                        component={RouterLink}
                        to={`/assignments/${s.assignmentId._id}`}
                        color="primary"
                        sx={{ textTransform: 'none', pl: 0 }}
                      >
                        {s.assignmentId.title}
                      </Button>
                    }
                    secondary={`Submitted: ${new Date(s.submittedAt).toLocaleString()} | Status: ${s.status}${typeof s.score === 'number' ? ` | Score: ${s.score}${s.assignmentId.maxScore ? '/' + s.assignmentId.maxScore : ''}` : ''}${s.feedback ? ` | Feedback: ${s.feedback}` : ''}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DashboardPage; 