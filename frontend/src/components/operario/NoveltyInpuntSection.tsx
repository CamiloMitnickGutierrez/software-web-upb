import React from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import { AutoAwesomeRounded } from '@mui/icons-material';

interface NoveltyInputSectionProps {
  rawNovelty: string;
  setRawNovelty: (val: string) => void;
  isAiProcessing: boolean;
  onSubmitAi: () => void;
}

export const NoveltyInputSection: React.FC<NoveltyInputSectionProps> = ({
  rawNovelty,
  setRawNovelty,
  isAiProcessing,
  onSubmitAi,
}) => (
  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#ffffff', border: '1px solid #edf2f7', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Detalla la Novedad</Typography>
      <Typography variant="body2" color="text.secondary">
        Describe de forma clara la novedad encontrada para el administrador.
      </Typography>

      <TextField
        multiline
        rows={4}
        placeholder="Ej: El grifo del lavamanos 2 gotea y la cerradura de la puerta principal está floja..."
        value={rawNovelty}
        onChange={(e) => setRawNovelty(e.target.value)}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
      />

      <Button
        variant="contained"
        fullWidth
        disabled={!rawNovelty.trim() || isAiProcessing}
        startIcon={<AutoAwesomeRounded />}
        onClick={onSubmitAi}
        sx={{ mt: 2, py: 1.5, borderRadius: 3, textTransform: 'none', fontWeight: 600, bgcolor: '#7c3aed' }}
      >
        {isAiProcessing ? 'Preparando informe...' : 'Generar informe'}
      </Button>
    </Paper>
  </Box>
);