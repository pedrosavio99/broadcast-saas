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

export default function Register({ mode, onToggle }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('As senhas não coincidem'); return; }
    if (password.length < 6) { toast.error('A senha deve ter pelo menos 6 caracteres'); return; }
    setLoading(true);
    try {
      await signUp(email, password);
      toast.success('Conta criada com sucesso!');
      navigate('/connections');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao cadastrar';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      px: 2, position: 'relative', overflow: 'hidden',
    }}>

      <Box sx={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: mode === 'light'
          ? 'radial-gradient(circle, rgba(48,209,88,0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(48,209,88,0.18) 0%, transparent 70%)',
        top: -100, left: -100, pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: mode === 'light'
          ? 'radial-gradient(circle, rgba(10,132,255,0.08) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(10,132,255,0.14) 0%, transparent 70%)',
        bottom: -80, right: -80, pointerEvents: 'none',
      }} />

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

      <Box sx={{
        width: '100%', maxWidth: 400,
        bgcolor: 'background.paper',
        borderRadius: 3, p: { xs: 3, sm: 4 },
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #30D158, #0A84FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mb: 1.5, boxShadow: '0 6px 24px rgba(48,209,88,0.35)',
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
            Crie sua conta gratuitamente
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            required fullWidth label="E-mail" type="email"
            value={email} autoComplete="email" size="small"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required fullWidth label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={password} autoComplete="new-password" size="small"
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" tabIndex={-1}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            required fullWidth label="Confirmar senha"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword} autoComplete="new-password" size="small"
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPassword.length > 0 && password !== confirmPassword}
            helperText={confirmPassword.length > 0 && password !== confirmPassword ? 'As senhas não coincidem' : ''}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small" tabIndex={-1}>
                      {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit" fullWidth variant="contained"
            disabled={loading}
            sx={{
              mt: 0.5, py: 1.2,
              fontSize: '0.95rem', fontWeight: 600, letterSpacing: '-0.1px',
              background: 'linear-gradient(135deg, #30D158 0%, #0A84FF 100%)',
            }}
          >
            {loading ? 'Criando conta…' : 'Criar conta'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Já tem conta?{' '}
              <MuiLink
                component={Link} to="/login"
                sx={{ color: '#0A84FF', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Faça login
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}