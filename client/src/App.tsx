import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './contexts/AuthContext';
import NewAssignmentPage from './pages/NewAssignmentPage';
import AssignmentDetailsPage from './pages/AssignmentDetailsPage';
import NotificationCenterPage from './pages/NotificationCenterPage';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link as RouterLink } from 'react-router-dom';
import SubmissionsPage from './pages/SubmissionsPage';
function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Assignment Management
          </Typography>
          {user && (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/notifications"
                startIcon={<NotificationsIcon />}
                sx={{ mr: 1 }}
              >
                Notifications
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/assignments/new" element={<NewAssignmentPage />} />
              <Route path="/assignments/:id" element={<AssignmentDetailsPage />} />
              <Route path="/notifications" element={<NotificationCenterPage />} />
            </Route>
            <Route element={<PrivateRoute />}>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/assignments/new" element={<NewAssignmentPage />} />
  <Route path="/assignments/:id" element={<AssignmentDetailsPage />} />
  <Route path="/assignments/:id/submissions" element={<SubmissionsPage />} />
  <Route path="/notifications" element={<NotificationCenterPage />} />
</Route>

            {/* Add more protected routes inside <Route element={<PrivateRoute />} /> as needed */}
          </Routes>
        </Box>
      </Container>
    </>
  );
}

export default App;
