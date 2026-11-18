import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { WarningRounded, CheckRounded, CloseRounded } from '@mui/icons-material';

interface NoveltyChoiceSectionProps {
  onNoNovelty: () => void;
  onYesNovelty: () => void;
}

export const NoveltyChoiceSection: React.FC<NoveltyChoiceSectionProps> = ({ onNoNovelty, onYesNovelty }) => (
  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 3, textAlign: 'center' }}>
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: '#ffffff', border: '1px solid #edf2f7', width: '100%' }}>
      <WarningRounded sx={{ fontSize: 48, color: '#eab308', mb: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
        ¿Alguna novedad por reportar?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Indica si encontraste daños, grifos rotos, falta de suministros u otra incidencia en el baño.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<CloseRounded />}
          onClick={onNoNovelty}
          sx={{ py: 1.5, borderRadius: 3, textTransform: 'none', borderColor: '#cbd5e1', color: '#475569' }}
        >
          No, todo bien
        </Button>
        <Button
          variant="contained"
          fullWidth
          startIcon={<CheckRounded />}
          onClick={onYesNovelty}
          sx={{ py: 1.5, borderRadius: 3, textTransform: 'none', bgcolor: '#7c3aed' }}
        >
          Sí, reportar
        </Button>
      </Box>
    </Paper>
  </Box>
);