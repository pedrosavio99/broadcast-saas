import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import {
    Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, Dialog,
    DialogTitle, DialogContent, DialogActions, IconButton, Box,
} from '@mui/material';
import { Edit, Delete, Add, ArrowBack, Message } from '@mui/icons-material';
import { InlineAlert, ConfirmModal, FeedbackModal } from '../components/Modal';

function maskPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function Contacts() {
    const { connectionId } = useParams<{ connectionId: string }>();
    const navigate = useNavigate();
    const { contacts, loading, createContact, updateContact, deleteContact } = useContacts(connectionId ?? '');

    const [openModal, setOpenModal] = useState(false);
    const [editingContact, setEditingContact] = useState<{ id: string; name: string; phone: string } | null>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [formError, setFormError] = useState('');
    const [saving, setSaving] = useState(false);

    const [feedback, setFeedback] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message?: string }>({
        open: false, type: 'success', title: '',
    });

    const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string; name: string; loading: boolean }>({
        open: false, id: '', name: '', loading: false,
    });

    const handleOpenModal = (contact?: { id: string; name: string; phone: string }) => {
        setFormError('');
        if (contact) {
            setEditingContact(contact);
            setName(contact.name);
            setPhone(contact.phone);
        } else {
            setEditingContact(null);
            setName('');
            setPhone('');
        }
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setName('');
        setPhone('');
        setFormError('');
        setEditingContact(null);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(maskPhone(e.target.value));
        setFormError('');
    };

    const handleSave = async () => {
        if (!name.trim()) { setFormError('Nome é obrigatório'); return; }
        if (!phone.trim()) { setFormError('Telefone é obrigatório'); return; }
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 10) { setFormError('Telefone inválido — informe DDD + número'); return; }
        setSaving(true);
        setFormError('');
        try {
            if (editingContact) {
                await updateContact(editingContact.id, name.trim(), phone.trim());
                handleClose();
                setFeedback({ open: true, type: 'success', title: 'Contato atualizado!', message: `${name.trim()} foi salvo com sucesso.` });
            } else {
                await createContact(name.trim(), phone.trim());
                handleClose();
                setFeedback({ open: true, type: 'success', title: 'Contato adicionado!', message: `${name.trim()} já está na sua lista.` });
            }
        } catch {
            setFormError('Não foi possível salvar. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteConfirm = async () => {
        const deletedName = confirmDelete.name;
        setConfirmDelete(prev => ({ ...prev, loading: true }));
        try {
            await deleteContact(confirmDelete.id);
            setConfirmDelete({ open: false, id: '', name: '', loading: false });
            setFeedback({ open: true, type: 'success', title: 'Contato excluído', message: `${deletedName} foi removido.` });
        } catch {
            setConfirmDelete(prev => ({ ...prev, loading: false }));
            setFeedback({ open: true, type: 'error', title: 'Erro ao excluir', message: 'Não foi possível excluir o contato. Tente novamente.' });
        }
    };

    const avatarColor = (n: string) => {
        const hue = (n.charCodeAt(0) * 37) % 360;
        return { bg: `hsl(${hue},60%,85%)`, text: `hsl(${hue},60%,30%)` };
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
                    <IconButton onClick={() => navigate('/connections')} size="small"
                        sx={{ color: '#0A84FF', '&:hover': { bgcolor: 'rgba(10,132,255,0.08)' } }}>
                        <ArrowBack fontSize="small" />
                    </IconButton>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>Contatos</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                            {contacts.length} {contacts.length === 1 ? 'contato' : 'contatos'}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button variant="outlined" startIcon={<Message />}
                        onClick={() => navigate(`/connections/${connectionId}/messages`)}
                        sx={{ borderRadius: 10, borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#0A84FF', color: '#0A84FF' } }}>
                        Mensagens
                    </Button>
                    <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenModal()} sx={{ borderRadius: 10 }}>
                        Novo Contato
                    </Button>
                </Box>
            </Box>

            {/* Table */}
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Telefone</TableCell>
                                <TableCell align="right" sx={{ pr: 2 }}>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={3} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>Carregando…</TableCell></TableRow>
                            ) : contacts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} sx={{ textAlign: 'center', py: 8 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 48, height: 48, borderRadius: 12, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Add sx={{ color: 'text.secondary' }} />
                                            </Box>
                                            <Typography color="text.secondary" variant="body2">Nenhum contato ainda</Typography>
                                            <Typography color="text.disabled" variant="caption">Adicione contatos para enviar mensagens</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contacts.map((contact) => {
                                    const { bg, text } = avatarColor(contact.name);
                                    return (
                                        <TableRow key={contact.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box sx={{ width: 34, height: 34, borderRadius: 9, bgcolor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: text }}>{contact.name.charAt(0).toUpperCase()}</Typography>
                                                    </Box>
                                                    <Typography sx={{ fontWeight: 500 }}>{contact.name}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace', letterSpacing: '0.02em' }}>{contact.phone}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                                    <IconButton size="small" onClick={() => handleOpenModal({ id: contact.id, name: contact.name, phone: contact.phone })}
                                                        sx={{ color: 'text.secondary', '&:hover': { color: '#0A84FF', bgcolor: 'rgba(10,132,255,0.08)' } }}>
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small" color="error" onClick={() => setConfirmDelete({ open: true, id: contact.id, name: contact.name, loading: false })}
                                                        sx={{ '&:hover': { bgcolor: 'rgba(255,69,58,0.08)' } }}>
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Form Modal */}
            <Dialog open={openModal} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>{editingContact ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
                    <TextField
                        autoFocus label="Nome completo" fullWidth value={name}
                        onChange={(e) => { setName(e.target.value); setFormError(''); }}
                        placeholder="Ex: João Silva"
                        error={!!formError && !name.trim()}
                    />
                    <TextField
                        label="Telefone"
                        fullWidth
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="(11) 99999-9999"
                        slotProps={{
                            htmlInput: {
                                inputMode: 'numeric',
                            },
                        }}
                        helperText="DDD + número com 8 ou 9 dígitos"
                        error={!!formError && !phone.trim()}
                    />
                    {formError && <InlineAlert message={formError} />}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={handleClose} sx={{ color: 'text.secondary' }} disabled={saving}>Cancelar</Button>
                    <Button onClick={handleSave} variant="contained" disabled={saving}>
                        {saving ? 'Salvando…' : editingContact ? 'Salvar' : 'Adicionar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Delete */}
            <ConfirmModal
                open={confirmDelete.open}
                title="Excluir contato?"
                message={`"${confirmDelete.name}" será removido permanentemente desta conexão.`}
                loading={confirmDelete.loading}
                onConfirm={handleDeleteConfirm}
                onClose={() => setConfirmDelete({ open: false, id: '', name: '', loading: false })}
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