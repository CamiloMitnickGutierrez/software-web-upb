import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { TimerRounded } from '@mui/icons-material';

interface MapHeaderProps {
  scannedZone: string;
  formattedTime: string;
}

export const MapHeader: React.FC<MapHeaderProps> = ({ scannedZone, formattedTime }) => (
  <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: '#1e1b4b', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <Box>
      <Typography variant="caption" sx={{ opacity: 0.8 }}>Zona en limpieza (en vivo)</Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{scannedZone || 'Baño del edificio principal'}</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'rgba(255,255,255,0.15)', px: 2, py: 1, borderRadius: 2 }}>
      <TimerRounded color="inherit" />
      <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{formattedTime}</Typography>
    </Box>
  </Paper>
);
