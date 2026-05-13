import { createTheme } from '@mui/material/styles';

export function buildTheme(mode: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
      primary: { main: '#0A84FF' },
      secondary: { main: '#30D158' },

      background: {
        default: mode === 'light' ? '#F2F2F7' : '#000000',
        paper: mode === 'light' ? '#FFFFFF' : '#1C1C1E',
      },

      text: {
        primary: mode === 'light' ? '#1C1C1E' : '#FFFFFF',
        secondary: mode === 'light' ? '#6E6E73' : '#8E8E93',
      },

      divider:
        mode === 'light'
          ? 'rgba(0,0,0,0.08)'
          : 'rgba(255,255,255,0.08)',
    },

    typography: {
      fontFamily:
        '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',

      h4: {
        fontWeight: 700,
        letterSpacing: '-0.5px',
      },

      h5: {
        fontWeight: 600,
        letterSpacing: '-0.3px',
      },

      h6: {
        fontWeight: 600,
        letterSpacing: '-0.2px',
      },
    },

    shape: {
      borderRadius: 12,
    },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 10,
            fontWeight: 600,
            letterSpacing: '-0.1px',
            boxShadow: 'none',

            '&:hover': {
              boxShadow: 'none',
            },
          },
        },

        variants: [
          {
            props: {
              variant: 'contained',
              color: 'primary',
            },

            style: {
              background:
                'linear-gradient(135deg, #0A84FF 0%, #0066CC 100%)',
            },
          },
        ],
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',

            boxShadow:
              mode === 'light'
                ? '0 2px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)'
                : '0 2px 20px rgba(0,0,0,0.4)',
          },
        },
      },

      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            fontSize: '0.78rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',

            color:
              mode === 'light'
                ? '#6E6E73'
                : '#8E8E93',

            borderBottom:
              mode === 'light'
                ? '1px solid rgba(0,0,0,0.06)'
                : '1px solid rgba(255,255,255,0.06)',
          },

          body: {
            borderBottom:
              mode === 'light'
                ? '1px solid rgba(0,0,0,0.04)'
                : '1px solid rgba(255,255,255,0.04)',
          },
        },
      },

      MuiTableRow: {
        styleOverrides: {
          root: {
            transition: 'background 0.15s ease',

            '&:hover': {
              background:
                mode === 'light'
                  ? 'rgba(0,0,0,0.02)'
                  : 'rgba(255,255,255,0.03)',
            },
          },
        },
      },

      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,

              '& fieldset': {
                borderColor:
                  mode === 'light'
                    ? 'rgba(0,0,0,0.12)'
                    : 'rgba(255,255,255,0.12)',
              },

              '&:hover fieldset': {
                borderColor: '#0A84FF',
              },
            },
          },
        },
      },

      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 18,

            boxShadow:
              mode === 'light'
                ? '0 24px 80px rgba(0,0,0,0.18)'
                : '0 24px 80px rgba(0,0,0,0.7)',
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            fontSize: '0.75rem',
          },
        },
      },

      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
            borderRadius: '10px !important',
            border: 'none',
            padding: '6px 16px',

            '&.Mui-selected': {
              background: '#0A84FF',
              color: '#fff',

              '&:hover': {
                background: '#0066CC',
              },
            },
          },
        },
      },

      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            background:
              mode === 'light'
                ? 'rgba(0,0,0,0.05)'
                : 'rgba(255,255,255,0.08)',

            borderRadius: 12,
            padding: 4,
            gap: 2,
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition:
              'background 0.15s ease, transform 0.1s ease',

            '&:hover': {
              transform: 'scale(1.08)',
            },
          },
        },
      },
    },
  });
}