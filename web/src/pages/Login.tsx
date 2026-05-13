import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Box, Typography, TextField, Button,
  Link as MuiLink, InputAdornment, IconButton, Tooltip,
} from '@mui/material';
import { Visibility, VisibilityOff, LightMode, DarkMode } from '@mui/icons-material';

interface Props {
  mode: 'light' | 'dark';
  onToggle: () => void;
}

export default function Login({ mode, onToggle }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Bem-vindo de volta!');
      navigate('/connections');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer login';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      px: 2,
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background blobs */}
      <Box sx={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: mode === 'light'
          ? 'radial-gradient(circle, rgba(10,132,255,0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(10,132,255,0.18) 0%, transparent 70%)',
        top: -100, right: -100, pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: mode === 'light'
          ? 'radial-gradient(circle, rgba(48,209,88,0.08) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(48,209,88,0.12) 0%, transparent 70%)',
        bottom: -80, left: -80, pointerEvents: 'none',
      }} />

      {/* Dark mode toggle top-right */}
      <Tooltip title={mode === 'light' ? 'Modo escuro' : 'Modo claro'}>
        <IconButton
          onClick={onToggle}
          sx={{
            position: 'absolute', top: 16, right: 16,
            color: mode === 'light' ? '#6E6E73' : '#8E8E93',
            '&:hover': { color: '#0A84FF', background: 'rgba(10,132,255,0.1)' },
          }}
        >
          {mode === 'light' ? <DarkMode /> : <LightMode />}
        </IconButton>
      </Tooltip>

      {/* Card */}
      <Box sx={{
        width: '100%', maxWidth: 400,
        bgcolor: 'background.paper',
        borderRadius: 3,
        p: { xs: 3, sm: 4 },
        boxShadow: mode === 'light'
          ? '0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)'
          : '0 8px 40px rgba(0,0,0,0.5)',
        position: 'relative', zIndex: 1,
        animation: 'fadeUp 0.4s ease',
        '@keyframes fadeUp': {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
      }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #0A84FF, #30D158)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mb: 1.5,
            boxShadow: '0 6px 24px rgba(10,132,255,0.35)',
          }}>
            <svg width="24" height="24" viewBox="0 0 14 14" fill="none">
              <circle cx="4" cy="7" r="2.5" fill="white" opacity="0.9"/>
              <circle cx="10" cy="4" r="2" fill="white" opacity="0.7"/>
              <circle cx="10" cy="10" r="2" fill="white" opacity="0.7"/>
              <line x1="6.4" y1="6.1" x2="8.3" y2="4.8" stroke="white" strokeWidth="1.2" strokeOpacity="0.8"/>
              <line x1="6.4" y1="7.9" x2="8.3" y2="9.2" stroke="white" strokeWidth="1.2" strokeOpacity="0.8"/>
            </svg>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.3px' }}>
            Broadcast
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Entre na sua conta
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            required
            fullWidth
            label="E-mail"
            type="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            size="small"
          />
          <TextField
            required
            fullWidth
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            size="small"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 0.5, py: 1.2,
              fontSize: '0.95rem',
              fontWeight: 600,
              letterSpacing: '-0.1px',
            }}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Não tem conta?{' '}
              <MuiLink
                component={Link}
                to="/register"
                sx={{ color: '#0A84FF', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Cadastre-se
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}