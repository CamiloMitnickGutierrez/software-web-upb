import React from 'react';
import { Box, Paper, Typography, Button, Chip } from '@mui/material';
import { ArrowForwardRounded, CheckCircleRounded, TimerRounded } from '@mui/icons-material';

interface HomeSectionProps {
  onStartScan: () => void;
  lastCleaning: { zone: string; time: string; date: string } | null;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onStartScan, lastCleaning }) => (
  <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 3 }, overflow: 'hidden' }}>
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        background: 'linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)',
        color: '#3b0764',
        boxShadow: '0 10px 25px -5px rgba(216, 180, 254, 0.4)',
      }}
    >
      <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1, fontWeight: 700 }}>
        Turno Activo • UPB
      </Typography>
      <Typography variant="h5" sx={{ mt: 1, mb: 1, fontWeight: 800 }}>
        Control de Aseo
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
        Escanea el código QR del baño asignado para iniciar la limpieza en tiempo real.
      </Typography>

      <Button
        variant="contained"
        disableElevation
        endIcon={<ArrowForwardRounded />}
        onClick={onStartScan}
        sx={{
          bgcolor: '#3b0764',
          color: '#fff',
          borderRadius: 3,
          py: 1,
          px: 2.5,
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': { bgcolor: '#581c87' },
        }}
      >
        Escanear Baño (QR)
      </Button>
    </Paper>

    {lastCleaning ? (
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 4,
          bgcolor: '#ffffff',
          border: '1px solid #edf2f7',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700 }}>
            Último Aseo Registrado
          </Typography>
          <Chip label="Completado" color="success" size="small" sx={{ borderRadius: 2 }} />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Zona: <strong>{lastCleaning.zone}</strong>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <TimerRounded fontSize="small" color="primary" />
          <Typography variant="body2">Tiempo empleado: <strong>{lastCleaning.time}</strong></Typography>
        </Box>
      </Paper>
    ) : (
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 4,
          bgcolor: '#ffffff',
          border: '1px solid #edf2f7',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box sx={{ width: 48, height: 48, borderRadius: 3, bgcolor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircleRounded />
        </Box>
        <Box>
          <Typography variant="subtitle2" color="text.primary" sx={{ fontWeight: 700 }}>Sin reportes recientes</Typography>
          <Typography variant="body2" color="text.secondary">Inicia un escaneo para registrar actividad.</Typography>
        </Box>
      </Paper>
    )}
  </Box>
);