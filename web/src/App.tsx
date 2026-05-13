import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box, IconButton, Tooltip } from '@mui/material';

import {
  LightMode,
  DarkMode,
  Logout,
} from '@mui/icons-material';

import { useAuth } from './contexts/AuthContext';
import { ColorModeContext } from './contexts/ColorModeContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Connections from './pages/Connections';
import Contacts from './pages/Contacts';
import Messages from './pages/Messages';
import { buildTheme } from './utils/buildTheme';

/* ────────────────────────────────────────────────────────── */
/* NavBar */
/* ────────────────────────────────────────────────────────── */

function NavBar({
  mode,
  onToggle,
}: {
  mode: 'light' | 'dark';
  onToggle: () => void;
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1200,

        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',

        background:
          mode === 'light'
            ? 'rgba(255,255,255,0.72)'
            : 'rgba(28,28,30,0.72)',

        borderBottom:
          mode === 'light'
            ? '1px solid rgba(0,0,0,0.08)'
            : '1px solid rgba(255,255,255,0.08)',

        display: 'flex',
        alignItems: 'center',

        px: { xs: 2, md: 4 },
        height: 52,
        gap: 2,
      }}
    >
      {/* Logo */}
      <Box
        onClick={() => navigate('/connections')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',

          '&:hover span': {
            color: '#0A84FF',
          },
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 7,

            background:
              'linear-gradient(135deg, #0A84FF, #30D158)',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <circle
              cx="4"
              cy="7"
              r="2.5"
              fill="white"
              opacity="0.9"
            />

            <circle
              cx="10"
              cy="4"
              r="2"
              fill="white"
              opacity="0.7"
            />

            <circle
              cx="10"
              cy="10"
              r="2"
              fill="white"
              opacity="0.7"
            />

            <line
              x1="6.4"
              y1="6.1"
              x2="8.3"
              y2="4.8"
              stroke="white"
              strokeWidth="1.2"
              strokeOpacity="0.8"
            />

            <line
              x1="6.4"
              y1="7.9"
              x2="8.3"
              y2="9.2"
              stroke="white"
              strokeWidth="1.2"
              strokeOpacity="0.8"
            />
          </svg>
        </Box>

        <Box
          component="span"
          sx={{
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '-0.2px',

            transition: 'color 0.15s',

            color:
              mode === 'light'
                ? '#1C1C1E'
                : '#FFFFFF',
          }}
        >
          Broadcast
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* User email */}
      {user && (
        <Box
          sx={{
            fontSize: '0.78rem',

            color:
              mode === 'light'
                ? '#6E6E73'
                : '#8E8E93',

            display: {
              xs: 'none',
              sm: 'block',
            },

            maxWidth: 180,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {user.email}
        </Box>
      )}

      {/* Theme Toggle */}
      <Tooltip
        title={
          mode === 'light'
            ? 'Modo escuro'
            : 'Modo claro'
        }
      >
        <IconButton
          onClick={onToggle}
          size="small"
          sx={{
            color:
              mode === 'light'
                ? '#6E6E73'
                : '#8E8E93',

            '&:hover': {
              color: '#0A84FF',
              background: 'rgba(10,132,255,0.1)',
            },
          }}
        >
          {mode === 'light' ? (
            <DarkMode fontSize="small" />
          ) : (
            <LightMode fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      {/* Logout */}
      {user && (
        <Tooltip title="Sair">
          <IconButton
            onClick={handleLogout}
            size="small"
            sx={{
              color:
                mode === 'light'
                  ? '#6E6E73'
                  : '#8E8E93',

              '&:hover': {
                color: '#FF453A',
                background: 'rgba(255,69,58,0.1)',
              },
            }}
          >
            <Logout fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Private Layout */
/* ────────────────────────────────────────────────────────── */

function PrivateLayout({
  children,
  mode,
  onToggle,
}: {
  children: React.ReactNode;
  mode: 'light' | 'dark';
  onToggle: () => void;
}) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <NavBar
        mode={mode}
        onToggle={onToggle}
      />

      <Box
        sx={{
          maxWidth: 960,
          mx: 'auto',

          px: {
            xs: 2,
            md: 3,
          },

          py: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/* ────────────────────────────────────────────────────────── */
/* App */
/* ────────────────────────────────────────────────────────── */

export default function App() {
  const { user, loading } = useAuth();

  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    return (
      (localStorage.getItem(
        'colorMode'
      ) as 'light' | 'dark') || 'light'
    );
  });

  const toggleMode = () => {
    setMode((prev) => {
      const next =
        prev === 'light'
          ? 'dark'
          : 'light';

      localStorage.setItem(
        'colorMode',
        next
      );

      return next;
    });
  };

  const theme = buildTheme(mode);

  if (loading) {
    return (
      <ThemeProvider theme={buildTheme('light')}>
        <CssBaseline />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            height: '100vh',

            gap: 1.5,
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 10,

              background:
                'linear-gradient(135deg, #0A84FF, #30D158)',

              animation:
                'pulse 1.4s ease-in-out infinite',

              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                  transform: 'scale(1)',
                },

                '50%': {
                  opacity: 0.6,
                  transform: 'scale(0.9)',
                },
              },
            }}
          />
        </Box>
      </ThemeProvider>
    );
  }

  const privateRoute = (
    child: React.ReactNode
  ) =>
    user ? (
      <PrivateLayout
        mode={mode}
        onToggle={toggleMode}
      >
        {child}
      </PrivateLayout>
    ) : (
      <Navigate to="/login" />
    );

  return (
    <ColorModeContext.Provider
      value={{
        toggle: toggleMode,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Routes>
          <Route
            path="/login"
            element={
              !user ? (
                <Login
                  mode={mode}
                  onToggle={toggleMode}
                />
              ) : (
                <Navigate to="/connections" />
              )
            }
          />

          <Route
            path="/register"
            element={
              !user ? (
                <Register
                  mode={mode}
                  onToggle={toggleMode}
                />
              ) : (
                <Navigate to="/connections" />
              )
            }
          />

          <Route
            path="/connections"
            element={privateRoute(
              <Connections />
            )}
          />

          <Route
            path="/connections/:connectionId/contacts"
            element={privateRoute(
              <Contacts />
            )}
          />

          <Route
            path="/connections/:connectionId/messages"
            element={privateRoute(
              <Messages />
            )}
          />

          <Route
            path="/"
            element={
              <Navigate
                to={
                  user
                    ? '/connections'
                    : '/login'
                }
              />
            }
          />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}