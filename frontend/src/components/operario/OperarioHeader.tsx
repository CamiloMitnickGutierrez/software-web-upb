import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { ArrowBackRounded, LogoutRounded } from '@mui/icons-material';

interface OperarioHeaderProps {
  user: { nombre?: string; apellido?: string } | null;
  onLogout: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export const OperarioHeader: React.FC<OperarioHeaderProps> = ({ user, onLogout, showBack = false, onBack }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1.5, sm: 3 }, minHeight: 42, flexShrink: 0 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700, width: 42, height: 42 }}>
        {user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'O'}
      </Avatar>
      <Box>
        <Typography variant="body2" color="text.secondary">Hola,</Typography>
        <Typography variant="subtitle1" color="text.primary" sx={{ lineHeight: 1.2, fontWeight: 700 }}>
          {user?.nombre || 'Operaria'}
        </Typography>
      </Box>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {showBack && (
        <IconButton onClick={onBack} aria-label="Volver" sx={{ color: 'text.secondary' }}>
          <ArrowBackRounded />
        </IconButton>
      )}
      <IconButton onClick={onLogout} aria-label="Cerrar sesión" sx={{ color: 'text.secondary' }}>
        <LogoutRounded />
      </IconButton>
    </Box>
  </Box>
);