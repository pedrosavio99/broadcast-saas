import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMessages } from '../hooks/useMessages';
import { useContacts } from '../hooks/useContacts';
import {
    Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Dialog,
    DialogTitle, DialogContent, DialogActions, IconButton, Box,
    Chip, ToggleButton, ToggleButtonGroup, Checkbox, FormControlLabel,
    FormGroup, Avatar, Tooltip,
} from '@mui/material';
import { Edit, Delete, Add, ArrowBack, Schedule, Send, CheckCircle, AccessTime } from '@mui/icons-material';
import { InlineAlert, ConfirmModal, FeedbackModal } from '../components/Modal';

type StatusFilter = 'all' | 'scheduled' | 'sent';

const avatarColor = (name: string) => {
    const hue = (name.charCodeAt(0) * 37) % 360;
    return { bg: `hsl(${hue},60%,85%)`, text: `hsl(${hue},60%,30%)` };
};

export default function Messages() {
    const { connectionId } = useParams<{ connectionId: string }>();
    const navigate = useNavigate();
    const { messages, loading, createMessage, updateMessage, deleteMessage } = useMessages(connectionId ?? '');
    const { contacts } = useContacts(connectionId ?? '');

    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [openModal, setOpenModal] = useState(false);
    const [editingMessage, setEditingMessage] = useState<{ id: string; content: string; contacts: string[]; scheduledAt?: Date } | null>(null);
    const [content, setContent] = useState('');
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [scheduledAt, setScheduledAt] = useState('');
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    const [feedback, setFeedback] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message?: string }>({
        open: false, type: 'success', title: '',
    });

    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string; loading: boolean }>({
        open: false, id: '', loading: false,
    });

    const filteredMessages = messages.filter((msg) =>
        statusFilter === 'all' ? true : msg.status === statusFilter
    );

    const handleOpenModal = (message?: { id: string; content: string; contacts: string[]; scheduledAt?: Date }) => {
        setFormError('');
        if (message) {
            setEditingMessage(message);
            setContent(message.content);
            setSelectedContacts(message.contacts);
            if (message.scheduledAt) {
                setScheduleEnabled(true);
                const d = message.scheduledAt instanceof Date ? message.scheduledAt : (message.scheduledAt as { toDate: () => Date }).toDate();
                setScheduledAt(d.toISOString().slice(0, 16));
            } else {
                setScheduleEnabled(false);
                setScheduledAt('');
            }
        } else {
            setEditingMessage(null);
            setContent('');
            setSelectedContacts([]);
            setScheduleEnabled(false);
            setScheduledAt('');
        }
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setFormError('');
    };

    const handleToggleContact = (id: string) => {
        setSelectedContacts(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
        setFormError('');
    };

    const handleSelectAll = () => {
        setSelectedContacts(selectedContacts.length === contacts.length ? [] : contacts.map(c => c.id));
    };

    const handleSave = async () => {
        if (!content.trim()) { setFormError('Escreva a mensagem antes de continuar'); return; }
        if (selectedContacts.length === 0) { setFormError('Selecione ao menos um destinatário'); return; }
        if (scheduleEnabled && !scheduledAt) { setFormError('Informe a data e hora do agendamento'); return; }
        setSaving(true);
        setFormError('');
        const scheduledDate = scheduleEnabled ? new Date(scheduledAt) : undefined;
        try {
            if (editingMessage) {
                await updateMessage(editingMessage.id, content.trim(), selectedContacts, scheduledDate);
                handleClose();
                setFeedback({ open: true, type: 'success', title: 'Mensagem atualizada!', message: 'As alterações foram salvas.' });
            } else {
                await createMessage(content.trim(), selectedContacts, scheduledDate);
                handleClose();
                setFeedback({
                    open: true, type: 'success',
                    title: scheduledDate ? 'Mensagem agendada!' : 'Mensagem enviada!',
                    message: scheduledDate
                        ? `Será disparada em ${new Date(scheduledAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}.`
                        : `Enviada para ${selectedContacts.length} ${selectedContacts.length === 1 ? 'contato' : 'contatos'}.`,
                });
            }
        } catch {
            setFormError('Não foi possível salvar. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteConfirm = async () => {
        setConfirmDelete(prev => ({ ...prev, loading: true }));
        try {
            await deleteMessage(confirmDelete.id);
            setConfirmDelete({ open: false, id: '', loading: false });
            setFeedback({ open: true, type: 'success', title: 'Mensagem excluída', message: 'A mensagem foi removida.' });
        } catch {
            setConfirmDelete(prev => ({ ...prev, loading: false }));
            setFeedback({ open: true, type: 'error', title: 'Erro ao excluir', message: 'Não foi possível excluir a mensagem.' });
        }
    };

    const formatDate = (value: Date | { toDate: () => Date } | null | undefined) => {
        if (!value) return '—';
        const d = value instanceof Date ? value : value.toDate();
        return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Box sx={{
            animation: 'fadeUp 0.35s ease',
            '@keyframes fadeUp': {
                from: { opacity: 0, transform: 'translateY(12px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
            },
        }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={() => navigate(`/connections/${connectionId}/contacts`)} size="small"
                        sx={{ color: '#0A84FF', '&:hover': { bgcolor: 'rgba(10,132,255,0.08)' } }}>
                        <ArrowBack fontSize="small" />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>Mensagens</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                            {filteredMessages.length} {filteredMessages.length === 1 ? 'mensagem' : 'mensagens'}
                        </Typography>
                    </Box>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenModal()} sx={{ borderRadius: 10 }}>
                    Nova Mensagem
                </Button>
            </Box>

            {/* Filter */}
            <Box sx={{ mb: 2.5 }}>
                <ToggleButtonGroup value={statusFilter} exclusive onChange={(_, val) => val && setStatusFilter(val)} size="small">
                    <ToggleButton value="all">Todas</ToggleButton>
                    <ToggleButton value="scheduled"><AccessTime sx={{ fontSize: 14, mr: 0.5 }} />Agendadas</ToggleButton>
                    <ToggleButton value="sent"><CheckCircle sx={{ fontSize: 14, mr: 0.5 }} />Enviadas</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Table */}
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mensagem</TableCell>
                                <TableCell>Destinatários</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Data</TableCell>
                                <TableCell align="right" sx={{ pr: 2 }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>Carregando…</TableCell></TableRow>
                            ) : filteredMessages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 48, height: 48, borderRadius: 12, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Send sx={{ color: 'text.secondary' }} />
                                            </Box>
                                            <Typography color="text.secondary" variant="body2">Nenhuma mensagem ainda</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredMessages.map((msg) => (
                                    <TableRow key={msg.id}>
                                        <TableCell sx={{ maxWidth: 220 }}>
                                            <Typography variant="body2" sx={{
                                                overflow: 'hidden', textOverflow: 'ellipsis',
                                                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5,
                                            }}>
                                                {msg.content}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {msg.contacts.slice(0, 4).map(contactId => {
                                                    const contact = contacts.find(c => c.id === contactId);
                                                    if (!contact) return null;
                                                    const { bg, text } = avatarColor(contact.name);
                                                    return (
                                                        <Tooltip key={contactId} title={contact.name}>
                                                            <Avatar sx={{ width: 26, height: 26, fontSize: '0.7rem', fontWeight: 700, bgcolor: bg, color: text }}>
                                                                {contact.name.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                        </Tooltip>
                                                    );
                                                })}
                                                {msg.contacts.length > 4 && (
                                                    <Tooltip title={`+${msg.contacts.length - 4} mais`}>
                                                        <Avatar sx={{ width: 26, height: 26, fontSize: '0.65rem', bgcolor: 'action.selected' }}>
                                                            +{msg.contacts.length - 4}
                                                        </Avatar>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={msg.status === 'scheduled' ? <Schedule sx={{ fontSize: '14px !important' }} /> : <CheckCircle sx={{ fontSize: '14px !important' }} />}
                                                label={msg.status === 'scheduled' ? 'Agendada' : 'Enviada'}
                                                color={msg.status === 'scheduled' ? 'warning' : 'success'}
                                                size="small" variant="outlined" sx={{ fontWeight: 600 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                                                {msg.status === 'scheduled' ? formatDate(msg.scheduledAt) : formatDate(msg.sentAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                                <IconButton size="small"
                                                    onClick={() => handleOpenModal({
                                                        id: msg.id, content: msg.content, contacts: msg.contacts,
                                                        scheduledAt: msg.scheduledAt instanceof Date ? msg.scheduledAt
                                                            : msg.scheduledAt ? (msg.scheduledAt as { toDate: () => Date }).toDate() : undefined,
                                                    })}
                                                    sx={{ color: 'text.secondary', '&:hover': { color: '#0A84FF', bgcolor: 'rgba(10,132,255,0.08)' } }}>
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error"
                                                    onClick={() => setConfirmDelete({ open: true, id: msg.id, loading: false })}
                                                    sx={{ '&:hover': { bgcolor: 'rgba(255,69,58,0.08)' } }}>
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Form Modal */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>{editingMessage ? 'Editar Mensagem' : 'Nova Mensagem'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '8px !important' }}>
                    <TextField
                        autoFocus
                        label="Mensagem"
                        fullWidth
                        multiline
                        rows={3}
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            setFormError('');
                        }}
                        placeholder="Digite a mensagem que será enviada…"
                        slotProps={{
                            htmlInput: {
                                maxLength: 1000,
                            },
                        }}
                        helperText={`${content.length}/1000`}
                    />

                    {/* Contact picker */}
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Destinatários ({selectedContacts.length} selecionados)
                            </Typography>
                            {contacts.length > 0 && (
                                <Button size="small" onClick={handleSelectAll} sx={{ fontSize: '0.75rem', py: 0 }}>
                                    {selectedContacts.length === contacts.length ? 'Desmarcar todos' : 'Selecionar todos'}
                                </Button>
                            )}
                        </Box>
                        <Box sx={{ maxHeight: 160, overflowY: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 2.5, px: 0.5 }}>
                            {contacts.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                                    Nenhum contato nesta conexão
                                </Typography>
                            ) : (
                                <FormGroup>
                                    {contacts.map(contact => {
                                        const { bg, text } = avatarColor(contact.name);
                                        return (
                                            <FormControlLabel
                                                key={contact.id}
                                                sx={{ mx: 0, px: 1, py: 0.5, borderRadius: 2, '&:hover': { bgcolor: 'action.hover' }, transition: 'background 0.15s' }}
                                                control={
                                                    <Checkbox size="small" checked={selectedContacts.includes(contact.id)} onChange={() => handleToggleContact(contact.id)} sx={{ py: 0.5 }} />
                                                }
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.65rem', fontWeight: 700, bgcolor: bg, color: text }}>
                                                            {contact.name.charAt(0).toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>{contact.name}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{contact.phone}</Typography>
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                        );
                                    })}
                                </FormGroup>
                            )}
                        </Box>
                    </Box>

                    {/* Schedule */}
                    <Box>
                        <FormControlLabel
                            control={<Checkbox checked={scheduleEnabled} onChange={(e) => { setScheduleEnabled(e.target.checked); setFormError(''); }} size="small" />}
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Schedule sx={{ fontSize: 16, color: scheduleEnabled ? '#FF9F0A' : 'text.secondary' }} />
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Agendar envio</Typography>
                                </Box>
                            }
                        />
                        {scheduleEnabled && (
                            <TextField
                                label="Data e hora do disparo" type="datetime-local" fullWidth value={scheduledAt}
                                onChange={(e) => { setScheduledAt(e.target.value); setFormError(''); }}
                                sx={{ mt: 1.5 }}
                                slotProps={{
                                    inputLabel: { shrink: true },
                                    htmlInput: { min: new Date().toISOString().slice(0, 16) },
                                }}
                            />
                        )}
                    </Box>

                    {formError && <InlineAlert message={formError} />}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={handleClose} sx={{ color: 'text.secondary' }} disabled={saving}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" disabled={saving}
                        startIcon={saving ? undefined : scheduleEnabled ? <Schedule /> : <Send />}
                        sx={scheduleEnabled ? { background: 'linear-gradient(135deg, #FF9F0A, #FF6B00)' } : {}}>
                        {saving ? 'Salvando…' : editingMessage ? 'Salvar' : scheduleEnabled ? 'Agendar' : 'Enviar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Delete */}
            <ConfirmModal
                open={confirmDelete.open}
                title="Excluir mensagem?"
                message="Esta ação não pode ser desfeita."
                loading={confirmDelete.loading}
                onConfirm={handleDeleteConfirm}
                onClose={() => setConfirmDelete({ open: false, id: '', loading: false })}
            />

            {/* Feedback */}
            <FeedbackModal
                open={feedback.open}
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
                onClose={() => setFeedback(prev => ({ ...prev, open: false }))}
            />
        </Box>
    );
}