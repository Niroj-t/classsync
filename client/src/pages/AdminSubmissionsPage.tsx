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
import { Search, FilterList, Refresh } from '@mui/icons-material';
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

    const result = await fetchSubmissions(params);
    if (result?.pagination) {
      setTotalPages(result.pagination.pages || 1);
    }
  };

  useEffect(() => {
    fetchSubmissionsData();
  }, [page, search, statusFilter]);

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
              <MenuItem value="submitted">Submitted</MenuItem>
              <MenuItem value="late">Late</MenuItem>
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
              {/* Grade column removed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography color="textSecondary">No submissions found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission._id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {submission.assignment?.title || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {submission.submittedBy?.name || '—'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {submission.submittedBy?.email || ''}
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
                      {submission.assignment?.dueDate ? new Date(submission.assignment.dueDate).toLocaleDateString() : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getSubmissionStatus(submission)}
                  </TableCell>
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
