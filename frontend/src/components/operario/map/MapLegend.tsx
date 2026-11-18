import React from 'react';
import { Box, Typography } from '@mui/material';

export const MapLegend: React.FC = () => (
  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: -1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: '#eff6ff', border: '2px solid #3b82f6' }} />
      <Typography variant="caption" color="text.secondary">Aseo en proceso</Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: '#fee2e2', border: '2px solid #dc2626' }} />
      <Typography variant="caption" color="text.secondary">Novedad reportada</Typography>
    </Box>
  </Box>
);
