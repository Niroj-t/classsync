import { AppBar, Toolbar, Typography, Box, Button, IconButton, Dialog } from '@mui/material';
import { useState } from 'react';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CloseIcon from '@mui/icons-material/Close';
import logo from '../assets/react.svg';

export default function Navbar() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  return (
    <AppBar position="static" color="default" elevation={2} sx={{ mb: 4 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ height: 40, marginRight: 12 }} />
          <Typography variant="h6" color="inherit" noWrap>
            ClassSync
          </Typography>
        </Box>
        <Box>
          <Button color="primary" variant="outlined" sx={{ mr: 1 }} onClick={() => setOpenLogin(true)}>
            Login
          </Button>
          <Button color="primary" variant="contained" onClick={() => setOpenRegister(true)}>
            Sign Up
          </Button>
        </Box>
      </Toolbar>
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)} maxWidth="xs" fullWidth>
        <IconButton onClick={() => setOpenLogin(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <Box sx={{ p: 3, pt: 5 }}>
          <LoginPage />
        </Box>
      </Dialog>
      <Dialog open={openRegister} onClose={() => setOpenRegister(false)} maxWidth="xs" fullWidth>
        <IconButton onClick={() => setOpenRegister(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <Box sx={{ p: 3, pt: 5 }}>
          <RegisterPage />
        </Box>
      </Dialog>
    </AppBar>
  );
} 