import React from 'react';
import { Alert, Box, Typography, Button, Paper } from '@mui/material';
import { CameraAltRounded } from '@mui/icons-material';

interface ScannerSectionProps {
  onCancel: () => void;
  onRetry: () => void;
  error?: string | null;
}

export const ScannerSection: React.FC<ScannerSectionProps> = ({ onCancel, onRetry, error }) => (
  <Box sx={{ flex: 1, minHeight: 0, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 1, sm: 2 }, overflow: 'hidden' }}>
    <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>Escanea el código QR</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 1 }}>
      Apunta la cámara al código de la zona. Esto notificará al administrador en tiempo real.
    </Typography>
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 520,
        p: { xs: 1, sm: 2 },
        borderRadius: 4,
        border: '1px solid #e2e8f0',
        bgcolor: '#fff',
      }}
    >
        <Alert icon={<CameraAltRounded />} severity={error ? 'error' : 'info'} sx={{ mb: 1.5, borderRadius: 3 }}>
          {error || 'Permite el acceso a la cámara cuando el navegador lo solicite.'}
        </Alert>
      <Box
        id="reader"
        sx={{
          width: '100%',
          minHeight: { xs: 'clamp(150px, 32dvh, 280px)', sm: 380 },
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: '#0f172a',
          border: '1px solid #cbd5e1',
          p: { xs: 0.5, sm: 1 },
          '& video': {
            width: '100% !important',
            height: 'auto !important',
            display: 'block',
            borderRadius: 2,
          },
          '& #reader__scan_region': {
            minHeight: { xs: 'clamp(140px, 29dvh, 260px)', sm: 350 },
          },
          '& #reader__dashboard': {
            padding: '12px 8px !important',
          },
          '& button': {
            border: 'none',
            borderRadius: 2,
            padding: '8px 14px',
            cursor: 'pointer',
            fontWeight: 600,
          },
        }}
      />
    </Paper>
    <Box sx={{ display: 'flex', width: '100%', gap: 1.5, mt: 2 }}>
      {error && (
        <Button variant="contained" fullWidth onClick={onRetry} sx={{ borderRadius: 3, py: 1.2, textTransform: 'none' }}>
          Reintentar
        </Button>
      )}
      <Button variant="outlined" fullWidth onClick={onCancel} sx={{ borderRadius: 3, py: 1.2, textTransform: 'none' }}>
        Cancelar
      </Button>
    </Box>
  </Box>
);