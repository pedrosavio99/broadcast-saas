import {
    Dialog, DialogContent, DialogActions,
    Button, Box, Typography,
} from '@mui/material';
import { CheckCircle, ErrorOutlined, WarningAmberRounded, DeleteOutlined } from '@mui/icons-material';

/* ─── Types ─────────────────────────────────────────────── */
export type FeedbackType = 'success' | 'error';

interface FeedbackModalProps {
    open: boolean;
    type: FeedbackType;
    title: string;
    message?: string;
    onClose: () => void;
}

interface ConfirmModalProps {
    open: boolean;
    title: string;
    message?: string;
    confirmLabel?: string;
    loading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

/* ─── Inline field error (replaces toast for form validation) */
export interface FieldError {
    field: string;
    message: string;
}

/* ─── FeedbackModal ─────────────────────────────────────── */
export function FeedbackModal({ open, type, title, message, onClose }: FeedbackModalProps) {
    const isSuccess = type === 'success';

    const config = {
        success: {
            iconBg: 'rgba(48,209,88,0.12)',
            iconColor: '#30D158',
            icon: <CheckCircle sx={{ fontSize: 32, color: '#30D158' }} />,
            btnColor: '#30D158',
        },
        error: {
            iconBg: 'rgba(255,69,58,0.12)',
            iconColor: '#FF453A',
            icon: <ErrorOutlined sx={{ fontSize: 32, color: '#FF453A' }} />,
            btnColor: '#FF453A',
        },
    }[type];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        overflow: 'visible',
                        textAlign: 'center',
                        py: 1,
                    },
                },
            }}
        >
            <DialogContent sx={{ pt: 3, pb: 1 }}>
                {/* Icon */}
                <Box sx={{
                    width: 64, height: 64, borderRadius: '50%',
                    bgcolor: config.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 2,
                    animation: 'popIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
                    '@keyframes popIn': {
                        from: { opacity: 0, transform: 'scale(0.5)' },
                        to: { opacity: 1, transform: 'scale(1)' },
                    },
                }}>
                    {config.icon}
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: message ? 0.5 : 0 }}>
                    {title}
                </Typography>
                {message && (
                    <Typography variant="body2" color="text.secondary">
                        {message}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 1.5 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        minWidth: 120, borderRadius: 10,
                        background: isSuccess
                            ? 'linear-gradient(135deg, #30D158, #25A244)'
                            : 'linear-gradient(135deg, #FF453A, #CC2E26)',
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' },
                    }}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}

/* ─── ConfirmModal (for deletes) ────────────────────────── */
export function ConfirmModal({
    open, title, message, confirmLabel = 'Excluir', loading, onConfirm, onClose,
}: ConfirmModalProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        textAlign: 'center',
                        py: 1,
                    },
                },
            }}
        >
            <DialogContent sx={{ pt: 3, pb: 1 }}>
                <Box sx={{
                    width: 64, height: 64, borderRadius: '50%',
                    bgcolor: 'rgba(255,159,10,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto', mb: 2,
                    animation: 'popIn 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
                    '@keyframes popIn': {
                        from: { opacity: 0, transform: 'scale(0.5)' },
                        to: { opacity: 1, transform: 'scale(1)' },
                    },
                }}>
                    <WarningAmberRounded sx={{ fontSize: 32, color: '#FF9F0A' }} />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 700, mb: message ? 0.5 : 0 }}>
                    {title}
                </Typography>
                {message && (
                    <Typography variant="body2" color="text.secondary">
                        {message}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', gap: 1.5, pb: 3, pt: 1.5 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    sx={{
                        minWidth: 100, borderRadius: 10,
                        color: 'text.secondary',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={loading}
                    variant="contained"
                    startIcon={<DeleteOutlined />}
                    sx={{
                        minWidth: 120, borderRadius: 10,
                        background: 'linear-gradient(135deg, #FF453A, #CC2E26)',
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' },
                    }}
                >
                    {loading ? 'Excluindo…' : confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

/* ─── Inline Alert (replaces validation toasts inside forms) */
interface InlineAlertProps {
    message: string;
    type?: 'error' | 'warning';
}

export function InlineAlert({ message, type = 'error' }: InlineAlertProps) {
    const colors = {
        error: { bg: 'rgba(255,69,58,0.08)', border: 'rgba(255,69,58,0.25)', text: '#FF453A', icon: <ErrorOutlined sx={{ fontSize: 16, color: '#FF453A' }} /> },
        warning: { bg: 'rgba(255,159,10,0.08)', border: 'rgba(255,159,10,0.25)', text: '#FF9F0A', icon: <WarningAmberRounded sx={{ fontSize: 16, color: '#FF9F0A' }} /> },
    }[type];

    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 1.5, py: 1,
            bgcolor: colors.bg,
            border: `1px solid ${colors.border}`,
            borderRadius: 2,
            animation: 'slideIn 0.2s ease',
            '@keyframes slideIn': {
                from: { opacity: 0, transform: 'translateY(-4px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
            },
        }}>
            {colors.icon}
            <Typography variant="caption" sx={{ color: colors.text, fontWeight: 500 }}>
                {message}
            </Typography>
        </Box>
    );
}