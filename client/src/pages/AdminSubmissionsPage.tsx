import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Pagination,
  IconButton,
  Tooltip
} from '@mui/material';
<<<<<<< HEAD
import { Search, FilterList, Refresh } from '@mui/icons-material';
=======
import {
  Search,
  FilterList,
  Refresh,
  Assignment,
  Person,
  Grade
} from '@mui/icons-material';
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
import { useAdmin } from '../contexts/AdminContext';

const AdminSubmissionsPage: React.FC = () => {
  const {
    submissions,
    loading,
    error,
    fetchSubmissions,
    clearError
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSubmissionsData = async () => {
    const params: any = {
      page,
      limit: 10
    };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;

<<<<<<< HEAD
    const result = await fetchSubmissions(params);
    if (result?.pagination) {
      setTotalPages(result.pagination.pages || 1);
    }
=======
    await fetchSubmissions(params);
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
  };

  useEffect(() => {
    fetchSubmissionsData();
  }, [page, search, statusFilter]);

<<<<<<< HEAD
  // Grading removed from admin submissions view

  const getSubmissionStatus = (submission: any) => {
    const dueDateValue = submission?.assignment?.dueDate;
    if (!dueDateValue) {
      return <Chip label="—" color="default" size="small" />;
    }
    const dueDate = new Date(dueDateValue);
    const submittedAt = new Date(submission.submittedAt);
    const isLate = submittedAt > dueDate;
    return isLate
      ? <Chip label="Late" color="error" size="small" />
      : <Chip label="On Time" color="success" size="small" />;
=======
  const getGradeChip = (submission: any) => {
    if (submission.grade !== undefined && submission.grade !== null) {
      const grade = submission.grade;
      let color: 'success' | 'warning' | 'error' | 'default' = 'default';
      
      if (grade >= 90) color = 'success';
      else if (grade >= 70) color = 'warning';
      else if (grade >= 0) color = 'error';
      
      return <Chip label={`${grade}%`} color={color} size="small" />;
    } else {
      return <Chip label="Ungraded" color="default" size="small" />;
    }
  };

  const getSubmissionStatus = (submission: any) => {
    const dueDate = new Date(submission.assignment.dueDate);
    const submittedAt = new Date(submission.submittedAt);
    const isLate = submittedAt > dueDate;
    
    if (isLate) {
      return <Chip label="Late" color="error" size="small" />;
    } else {
      return <Chip label="On Time" color="success" size="small" />;
    }
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Submission Management
        </Typography>
        <IconButton onClick={fetchSubmissionsData} color="primary">
          <Refresh />
        </IconButton>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
          <TextField
            label="Search submissions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All Status</MenuItem>
<<<<<<< HEAD
              <MenuItem value="submitted">Submitted</MenuItem>
              <MenuItem value="late">Late</MenuItem>
=======
              <MenuItem value="graded">Graded</MenuItem>
              <MenuItem value="ungraded">Ungraded</MenuItem>
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Submissions Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Assignment</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
<<<<<<< HEAD
              {/* Grade column removed */}
=======
              <TableCell>Grade</TableCell>
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
<<<<<<< HEAD
                <TableCell colSpan={5} align="center">
=======
                <TableCell colSpan={6} align="center">
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
<<<<<<< HEAD
                <TableCell colSpan={5} align="center">
=======
                <TableCell colSpan={6} align="center">
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
                  <Typography color="textSecondary">No submissions found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission._id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
<<<<<<< HEAD
                      {submission.assignment?.title || '—'}
=======
                      {submission.assignment.title}
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
<<<<<<< HEAD
                        {submission.submittedBy?.name || '—'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {submission.submittedBy?.email || ''}
=======
                        {submission.submittedBy.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {submission.submittedBy.email}
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(submission.submittedAt).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
<<<<<<< HEAD
                      {submission.assignment?.dueDate ? new Date(submission.assignment.dueDate).toLocaleDateString() : '—'}
=======
                      {new Date(submission.assignment.dueDate).toLocaleDateString()}
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getSubmissionStatus(submission)}
                  </TableCell>
<<<<<<< HEAD
=======
                  <TableCell>
                    {getGradeChip(submission)}
                  </TableCell>
>>>>>>> a85ce94f8c53a7281e97162b415297d808b7c473
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default AdminSubmissionsPage;
