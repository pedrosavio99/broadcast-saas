import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConnections } from '../hooks/useConnections';
import {
  Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton, Box,
} from '@mui/material';
import { Edit, Delete, Add, ChevronRight } from '@mui/icons-material';
import { InlineAlert, ConfirmModal, FeedbackModal } from '../components/Modal';

export default function Connections() {
  const { connections, loading, createConnection, updateConnection, deleteConnection } = useConnections();
  const navigate = useNavigate();

  // Form modal
  const [openModal, setOpenModal] = useState(false);
  const [editingConnection, setEditingConnection] = useState<{ id: string; name: string } | null>(null);
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Feedback modal
  const [feedback, setFeedback] = useState<{ open: boolean; type: 'success' | 'error'; title: string; message?: string }>({
    open: false, type: 'success', title: '',
  });

  // Confirm delete modal
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string; name: string; loading: boolean }>({
    open: false, id: '', name: '', loading: false,
  });

  const handleOpenModal = (connection?: { id: string; name: string }) => {
    setFormError('');
    if (connection) {
      setEditingConnection(connection);
      setName(connection.name);
    } else {
      setEditingConnection(null);
      setName('');
    }
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
    setName('');
    setFormError('');
    setEditingConnection(null);
  };

  const handleSave = async () => {
    if (!name.trim()) { setFormError('Nome da conexão é obrigatório'); return; }
    setSaving(true);
    setFormError('');
    try {
      if (editingConnection) {
        await updateConnection(editingConnection.id, name.trim());
        handleClose();
        setFeedback({ open: true, type: 'success', title: 'Conexão atualizada!', message: `"${name.trim()}" foi salva com sucesso.` });
      } else {
        await createConnection(name.trim());
        handleClose();
        setFeedback({ open: true, type: 'success', title: 'Conexão criada!', message: `"${name.trim()}" já está disponível.` });
      }
    } catch {
      setFormError('Não foi possível salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id: string, connName: string) => {
    setConfirmDelete({ open: true, id, name: connName, loading: false });
  };

  const handleDeleteConfirm = async () => {
    const deletedName = confirmDelete.name;
    setConfirmDelete(prev => ({ ...prev, loading: true }));
    try {
      await deleteConnection(confirmDelete.id);
      setConfirmDelete({ open: false, id: '', name: '', loading: false });
      setFeedback({ open: true, type: 'success', title: 'Conexão excluída', message: `"${deletedName}" foi removida.` });
    } catch {
      setConfirmDelete(prev => ({ ...prev, loading: false }));
      setFeedback({ open: true, type: 'error', title: 'Erro ao excluir', message: 'Não foi possível excluir a conexão. Tente novamente.' });
    }
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Conexões</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {connections.length} {connections.length === 1 ? 'conexão' : 'conexões'} cadastradas
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenModal()} sx={{ borderRadius: 10, px: 2.5 }}>
          Nova Conexão
        </Button>
      </Box>

      {/* Table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome da Conexão</TableCell>
                <TableCell align="right" sx={{ pr: 2 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>Carregando…</TableCell>
                </TableRow>
              ) : connections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} sx={{ textAlign: 'center', py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: 12, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Add sx={{ color: 'text.secondary' }} />
                      </Box>
                      <Typography color="text.secondary" variant="body2">Nenhuma conexão ainda</Typography>
                      <Typography color="text.disabled" variant="caption">Clique em "Nova Conexão" para começar</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                connections.map((conn) => (
                  <TableRow key={conn.id} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/connections/${conn.id}/contacts`)}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                          width: 36, height: 36, borderRadius: 9,
                          background: 'linear-gradient(135deg, rgba(10,132,255,0.12), rgba(48,209,88,0.12))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#0A84FF' }}>
                            {conn.name.charAt(0).toUpperCase()}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 500 }}>{conn.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5 }}>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigate(`/connections/${conn.id}/contacts`); }}
                          sx={{ color: 'text.secondary', '&:hover': { color: '#0A84FF', bgcolor: 'rgba(10,132,255,0.08)' } }}>
                          <ChevronRight fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenModal({ id: conn.id, name: conn.name }); }}
                          sx={{ color: 'text.secondary', '&:hover': { color: '#0A84FF', bgcolor: 'rgba(10,132,255,0.08)' } }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDeleteClick(conn.id, conn.name); }}
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
      <Dialog open={openModal} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1, fontWeight: 700 }}>
          {editingConnection ? 'Editar Conexão' : 'Nova Conexão'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: '8px !important' }}>
          <TextField
            autoFocus
            label="Nome da conexão"
            fullWidth
            value={name}
            onChange={(e) => { setName(e.target.value); setFormError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Ex: Clientes VIP, Time de Vendas…"
            error={!!formError}
          />
          {formError && <InlineAlert message={formError} />}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={handleClose} sx={{ color: 'text.secondary' }} disabled={saving}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>
            {saving ? 'Salvando…' : editingConnection ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete */}
      <ConfirmModal
        open={confirmDelete.open}
        title="Excluir conexão?"
        message={`"${confirmDelete.name}" e todos os seus dados serão removidos permanentemente.`}
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