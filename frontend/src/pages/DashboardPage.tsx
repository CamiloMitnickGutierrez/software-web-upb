import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import {
  Alert,
  AppBar,
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  CssBaseline,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import HistoryIcon from '@mui/icons-material/History';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuIcon from '@mui/icons-material/Menu';
import { TimerRounded } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/use.AuthStore';
import { getAdminOverview, type AdminOverview, type AdminZone } from '../api/admin.api';
import { BathroomMap } from '../components/operario/map/BathroomMap';

const drawerWidth = 240;

const zoneIsPending = (zone: AdminZone) =>
  !['completed', 'complete', 'cleaned', 'limpio'].includes(zone.estado.toLowerCase());

const getMapStatus = (zone?: AdminZone): 'pending' | 'in_progress' | 'completed' | 'issue' => {
  if (!zone) return 'pending';
  const status = zone.estado.toLowerCase();
  if (['issue', 'novelty', 'novedad', 'rejected', 'rechazada'].includes(status)) return 'in_progress';
  if (['completed', 'complete', 'cleaned', 'limpio'].includes(status)) return 'completed';
  if (['in_progress', 'in-progress', 'processing', 'en_proceso'].includes(status)) return 'in_progress';
  return 'pending';
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character] || character
  ));

export const DashboardPage: React.FC = () => {
  const [view, setView] = useState<'zones' | 'history'>('zones');
  const [viewLoading, setViewLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [activeTimers, setActiveTimers] = useState<Record<number, number>>({});
  const [now, setNow] = useState(() => Date.now());
  const [assetNovelties, setAssetNovelties] = useState<Record<string, string>>({});
  const [generalNovelties, setGeneralNovelties] = useState<Record<number, string>>({});
  const [selectedNovelty, setSelectedNovelty] = useState<string | null>(null);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:899px)');

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const formatElapsed = (startedAt?: number) => {
    if (!startedAt) return '00:00';
    const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000));
    return `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`;
  };

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOverview(await getAdminOverview());
    } catch {
      setError('No se pudo cargar la información del dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'https://rutalimpia-api-camilo.azurewebsites.net', { autoConnect: true, reconnection: true, timeout: 5000 });
    const updateZone = (status: string) => (data: { zone_id?: number; zone?: string; novelty?: string; element?: string | null; started_at?: number }) => {
      setOverview((current) => {
        if (!current) return current;
        return {
          ...current,
          zones: current.zones.map((zone) => (
            (data.zone_id && zone.id === data.zone_id) || (!data.zone_id && zone.nombre === data.zone)
              ? { ...zone, estado: status }
              : zone
          )),
        };
      });
      if (data.zone_id) setSelectedZoneId(data.zone_id);
      if (data.zone_id && status === 'in_progress') {
        setActiveTimers((current) => ({ ...current, [data.zone_id as number]: data.started_at || Date.now() }));
      }
      if (data.zone_id && status === 'completed') {
        setActiveTimers((current) => {
          const next = { ...current };
          delete next[data.zone_id as number];
          return next;
        });
      }
      window.setTimeout(() => void loadOverview(), 600);
    };
    const handleStarted = updateZone('in_progress');
    const handleFinished = (data: { zone_id?: number; zone?: string; novelty?: string; element?: string | null }) => {
      updateZone('completed')(data);
    };
    const handleNovelty = (data: { zone_id?: number; zone?: string; novelty?: string; element?: string | null }) => {
      updateZone('issue')(data);
      if (data.zone_id && data.element && data.novelty) {
        setAssetNovelties((current) => ({
          ...current,
          [`${data.zone_id}:${data.element}`]: data.novelty || '',
        }));
      }
      if (data.zone_id && !data.element && data.novelty) {
        setGeneralNovelties((current) => ({
          ...current,
          [data.zone_id as number]: data.novelty || '',
        }));
      }
    };
    socket.on('admin:cleaning-started', handleStarted);
    socket.on('admin:cleaning-finished', handleFinished);
    socket.on('admin:cleaning-novelty', handleNovelty);
    return () => {
      socket.off('admin:cleaning-started', handleStarted);
      socket.off('admin:cleaning-finished', handleFinished);
      socket.off('admin:cleaning-novelty', handleNovelty);
      socket.disconnect();
    };
  }, [loadOverview]);

  const pendingZones = useMemo(
    () => overview?.zones.filter(zoneIsPending) || [],
    [overview],
  );

  const handleGenerateReport = () => {
    if (!overview) return;
    const completed = overview.zones.length - pendingZones.length;
    const rows = overview.history.map((item) => `
      <tr><td>${escapeHtml(`${item.operaria?.nombre || 'Sin'} ${item.operaria?.apellido || 'asignar'}`)}</td>
      <td>${escapeHtml(item.duracion || 'No registrada')}</td>
      <td>${escapeHtml(item.foto_estado)}</td><td>${escapeHtml(item.zona)}</td><td>${escapeHtml(item.novedad)}</td></tr>
    `).join('');
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      setError('El navegador bloqueó la ventana del reporte. Permite ventanas emergentes e inténtalo nuevamente.');
      return;
    }
    reportWindow.document.write(`<!doctype html><html><head><title>Reporte de instalaciones</title>
      <style>body{font-family:Arial,sans-serif;color:#1f2937;padding:32px}h1{color:#1976d2}
      .summary{display:flex;gap:24px;margin:24px 0}.metric{padding:16px;background:#eef5ff;border-radius:8px}
      table{border-collapse:collapse;width:100%;margin-top:24px}th,td{border:1px solid #ddd;padding:10px;text-align:left}
      th{background:#1976d2;color:white}@media print{button{display:none}}</style></head><body>
      <h1>Reporte de estado de instalaciones</h1><p>Generado: ${escapeHtml(new Date().toLocaleString())}</p>
      <div class="summary"><div class="metric">Zonas completadas: <b>${completed}</b></div>
      <div class="metric">Pendientes: <b>${pendingZones.length}</b></div>
      <div class="metric">Aseos registrados: <b>${overview.history.length}</b></div></div>
      <h2>Resumen profesional</h2><p>El sistema registra ${completed} zonas completadas y ${pendingZones.length}
      pendientes. Se recomienda priorizar las zonas pendientes y verificar periódicamente las evidencias fotográficas.</p>
      <h2>Historial de aseos</h2><table><thead><tr><th>Operaria</th><th>Duración</th><th>Foto</th><th>Zona</th><th>Novedad</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="5">No hay aseos registrados.</td></tr>'}</tbody></table>
      <button onclick="window.print()">Descargar / guardar como PDF</button>
      <button onclick="window.opener.location.assign('/dashboard');window.close()">Volver al panel</button></body></html>`);
    reportWindow.document.close();
    reportWindow.onafterprint = () => {
      reportWindow.close();
      window.location.assign('/dashboard');
    };
    reportWindow.focus();
    window.setTimeout(() => reportWindow.print(), 150);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewChange = (nextView: 'zones' | 'history') => {
    if (nextView === view) return;
    setViewLoading(true);
    window.setTimeout(() => {
      setView(nextView);
      setViewLoading(false);
    }, 220);
  };

  const selectedZone = overview?.zones.find((zone) => zone.id === selectedZoneId) || overview?.zones[0];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f6f8fb' }}>
      <CssBaseline />
      <Drawer variant={isMobile ? 'temporary' : 'permanent'} open={isMobile ? mobileMenuOpen : true} onClose={() => setMobileMenuOpen(false)} sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 0, bgcolor: '#102a43', color: 'white' } }}>
        <Toolbar><Typography variant="h6" sx={{ fontWeight: 800 }}>RUTA-LIMPIA UPB</Typography></Toolbar>
        <Divider sx={{ borderColor: 'rgba(255,255,255,.15)' }} />
        <List sx={{ px: 1, pt: 2 }}>
          <ListItemButton selected={view === 'zones'} onClick={() => { handleViewChange('zones'); setMobileMenuOpen(false); }} sx={{ borderRadius: 2, color: 'white', '&.Mui-selected': { bgcolor: '#1976d2' } }}>
            <MapIcon sx={{ mr: 1.5 }} /><ListItemText primary="Ver Zonas" />
          </ListItemButton>
          <ListItemButton selected={view === 'history'} onClick={() => { handleViewChange('history'); setMobileMenuOpen(false); }} sx={{ borderRadius: 2, color: 'white', '&.Mui-selected': { bgcolor: '#1976d2' } }}>
            <HistoryIcon sx={{ mr: 1.5 }} /><ListItemText primary="Historial" />
          </ListItemButton>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e5e7eb' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><IconButton onClick={() => setMobileMenuOpen(true)} sx={{ display: { xs: 'inline-flex', md: 'none' } }} aria-label="Abrir menú"><MenuIcon /></IconButton><Box><Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.15rem', sm: '1.5rem' } }}>Panel de administración</Typography><Typography variant="body2" color="text.secondary">Bienvenido, {user?.nombre}</Typography></Box></Stack>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}><IconButton onClick={() => void loadOverview()} aria-label="Actualizar"><RefreshIcon /></IconButton><Button sx={{ display: { xs: 'none', sm: 'inline-flex' } }} startIcon={<PictureAsPdfIcon />} variant="contained" onClick={handleGenerateReport}>Generar Reporte</Button><IconButton onClick={handleLogout} aria-label="Cerrar sesión"><LogoutIcon /></IconButton></Stack>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {loading && !overview ? <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 300 }}><CircularProgress /></Box> : (
            <>
              {view === 'zones' ? (
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    <Card sx={{ flex: 1, borderRadius: 3 }}><CardContent><Typography variant="h6" sx={{ fontWeight: 700 }}>Zonas pendientes</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>Actualización en tiempo real</Typography>{pendingZones.length ? pendingZones.map((zone) => <Box key={zone.id} sx={{ py: 1.2, borderBottom: '1px solid #edf0f4' }}><Typography sx={{ fontWeight: 600 }}>{zone.nombre}</Typography><Typography variant="body2" color="text.secondary">Piso: {zone.piso}</Typography></Box>) : <Typography color="success.main">Todas las zonas están limpias.</Typography>}</CardContent></Card>
                    <Card sx={{ flex: 1, borderRadius: 3 }}><CardContent><Typography variant="h6" sx={{ fontWeight: 700 }}>Operarias</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>Personal registrado</Typography>{overview?.operarias.map((operaria) => <Box key={operaria.id} sx={{ py: 1.2, borderBottom: '1px solid #edf0f4' }}><Typography sx={{ fontWeight: 600 }}>{operaria.nombre} {operaria.apellido}</Typography><Typography variant="body2" color="text.secondary">{operaria.correo}</Typography></Box>)}</CardContent></Card>
                  </Stack>
                  <Card sx={{ borderRadius: 3, minHeight: 320 }}><CardContent><Stack direction={{ xs: 'column', sm: 'row' }} sx={{ mb: 2, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}><Box><Typography variant="h6" sx={{ fontWeight: 700 }}>Plano interactivo del baño</Typography><Typography variant="body2" color="text.secondary">Gris: sin iniciar · amarillo: en proceso · verde: terminado · rojo: novedad.</Typography></Box><Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><Chip size="small" color="info" label="En vivo por Socket.IO" />{activeTimers[selectedZone?.id || -1] && <Chip icon={<TimerRounded />} color="warning" label={formatElapsed(activeTimers[selectedZone?.id || -1])} />}</Stack></Stack><Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>{overview?.zones.map((zone) => <Chip key={zone.id} label={`${zone.nombre} · ${zone.estado === 'in_progress' ? 'En proceso' : zone.estado}`} color={selectedZoneId === zone.id ? 'primary' : 'default'} onClick={() => setSelectedZoneId(zone.id)} />)}</Stack><BathroomMap readOnly status={getMapStatus(selectedZone)} generalNovelty={Boolean(selectedZone?.id && generalNovelties[selectedZone.id])} elementStatuses={Object.fromEntries(Object.entries(assetNovelties).filter(([key]) => key.startsWith(`${selectedZoneId}:`)).map(([key]) => [key.split(':')[1], 'issue' as const]))} onReadOnlySelect={(element) => { const novelty = element === 'general' ? generalNovelties[selectedZone?.id || -1] : assetNovelties[`${selectedZoneId}:${element}`]; if (novelty) setSelectedNovelty(novelty); }} isElementReported={() => false} /></CardContent></Card>
                </Stack>
              ) : (
                <Card sx={{ borderRadius: 3 }}><CardContent><Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Historial de aseos</Typography><Box sx={{ overflowX: 'auto' }}><Table><TableHead><TableRow><TableCell>Operaria</TableCell><TableCell>Duración</TableCell><TableCell>Estado de foto</TableCell><TableCell>Zona</TableCell><TableCell>Novedad</TableCell></TableRow></TableHead><TableBody>{overview?.history.map((item) => <TableRow key={item.id}><TableCell>{item.operaria ? `${item.operaria.nombre} ${item.operaria.apellido}` : 'No disponible'}</TableCell><TableCell>{item.duracion}</TableCell><TableCell><Chip size="small" color={item.foto_estado === 'Validada' ? 'success' : 'error'} label={item.foto_estado} /></TableCell><TableCell>{item.zona}</TableCell><TableCell>{item.novedad}</TableCell></TableRow>)}</TableBody></Table></Box></CardContent></Card>
              )}
            </>
          )}
        </Box>
        <Backdrop open={viewLoading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#1976d2', bgcolor: 'rgba(255,255,255,.55)' }}>
          <CircularProgress color="inherit" aria-label="Cargando vista" />
        </Backdrop>
        <Dialog open={Boolean(selectedNovelty)} onClose={() => setSelectedNovelty(null)} maxWidth="sm" fullWidth>
          <DialogTitle>Novedad reportada por la operaria</DialogTitle>
          <DialogContent dividers><Typography>{selectedNovelty}</Typography></DialogContent>
          <DialogActions><Button onClick={() => setSelectedNovelty(null)}>Cerrar</Button></DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
