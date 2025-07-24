import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  Button, 
  TextField, 
  Stack, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  IconButton
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import GradeIcon from '@mui/icons-material/Grade';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  maxScore?: number;
}

interface Submission {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  assignmentId: Assignment;
  status: string;
  score?: number;
  feedback?: string;
  submittedAt: string;
  files?: string[];
  text?: string;
}

const SubmissionsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gradingDialog, setGradingDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeForm, setGradeForm] = useState({ score: '', feedback: '' });
  const [gradingLoading, setGradingLoading] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/submissions/assignment/${id}`, {
          baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(res.data.data.submissions || []);
        setAssignment(res.data.data.assignment);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };
    if (token && id) fetchSubmissions();
  }, [token, id]);

  const handleGradeClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeForm({
      score: submission.score?.toString() || '',
      feedback: submission.feedback || ''
    });
    setGradingDialog(true);
  };

  const handleGradeSubmit = async () => {
    if (!selectedSubmission) return;
    
    setGradingLoading(true);
    try {
      await axios.put(`/api/submissions/${selectedSubmission._id}/grade`, gradeForm, {
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update the submission in the list
      setSubmissions(prev => prev.map(sub => 
        sub._id === selectedSubmission._id 
          ? { ...sub, score: Number(gradeForm.score), feedback: gradeForm.feedback }
          : sub
      ));
      
      setGradingDialog(false);
      setSelectedSubmission(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to grade submission');
    } finally {
      setGradingLoading(false);
    }
  };

  const downloadFile = (filePath: string, fileName: string) => {
    const url = filePath.startsWith('http') 
      ? filePath 
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${filePath.replace(/^\/+/, '')}`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Student Submissions</Typography>
      </Stack>

      {assignment && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">{assignment.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            Due: {new Date(assignment.dueDate).toLocaleString()}
            {assignment.maxScore && ` | Max Score: ${assignment.maxScore}`}
          </Typography>
        </Paper>
      )}

      {submissions.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No submissions yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Students haven't submitted any work for this assignment.
          </Typography>
        </Paper>
      ) : (
        <List>
          {submissions.map((submission) => (
            <Paper key={submission._id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6">
                        {submission.studentId.name}
                      </Typography>
                      <Chip 
                        label={submission.status} 
                        color={submission.status === 'submitted' ? 'primary' : 'default'}
                        size="small"
                      />
                      {submission.score !== undefined && (
                        <Chip 
                          label={`${submission.score}${assignment?.maxScore ? '/' + assignment.maxScore : ''}`}
                          color="success"
                          size="small"
                        />
                      )}
                    </Stack>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </Typography>
                      {submission.text && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Text:</strong> {submission.text}
                        </Typography>
                      )}
                      {submission.feedback && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Feedback:</strong> {submission.feedback}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <Stack direction="row" spacing={1}>
                  {submission.files && submission.files.length > 0 && (
                    <IconButton
                      onClick={() => downloadFile(submission.files![0], `submission_${submission.studentId.name}.pdf`)}
                      title="Download submission file"
                    >
                      <DownloadIcon />
                    </IconButton>
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<GradeIcon />}
                    onClick={() => handleGradeClick(submission)}
                  >
                    {submission.score !== undefined ? 'Update Grade' : 'Grade'}
                  </Button>
                </Stack>
              </ListItem>
            </Paper>
          ))}
        </List>
      )}

      <Dialog open={gradingDialog} onClose={() => setGradingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Grade Submission - {selectedSubmission?.studentId.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Score"
            type="number"
            value={gradeForm.score}
            onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
            fullWidth
            margin="normal"
            inputProps={{ 
              min: 0, 
              max: assignment?.maxScore || 100 
            }}
          />
          <TextField
            label="Feedback"
            value={gradeForm.feedback}
            onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradingDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleGradeSubmit} 
            variant="contained"
            disabled={gradingLoading}
          >
            {gradingLoading ? <CircularProgress size={24} /> : 'Save Grade'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubmissionsPage;