import React from 'react';
import { Box, IconButton } from '@mui/material';
import { HomeRounded, QrCodeScannerRounded } from '@mui/icons-material';

interface OperarioBottomNavProps {
  currentView: string;
  onNavigate: (view: 'home' | 'scanner') => void;
}

export const OperarioBottomNav: React.FC<OperarioBottomNavProps> = ({ currentView, onNavigate }) => (
  <Box
    sx={{
      position: 'fixed',
      bottom: 'max(12px, env(safe-area-inset-bottom))',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 24px)',
      maxWidth: 340,
      bgcolor: '#1e1b4b',
      borderRadius: 6,
      py: { xs: 0.75, sm: 1.5 },
      px: { xs: 2, sm: 4 },
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      boxShadow: '0 15px 30px rgba(30, 27, 75, 0.3)',
      zIndex: 1000,
    }}
  >
    <IconButton
      onClick={() => onNavigate('home')}
      sx={{
        color: currentView === 'home' ? '#ffffff' : 'rgba(255,255,255,0.4)',
        bgcolor: currentView === 'home' ? 'rgba(255,255,255,0.15)' : 'transparent',
        p: { xs: 1, sm: 1.5 },
        borderRadius: 3,
      }}
    >
      <HomeRounded sx={{ fontSize: 28 }} />
    </IconButton>

    <IconButton
      onClick={() => onNavigate('scanner')}
      sx={{
        color: currentView === 'scanner' ? '#ffffff' : 'rgba(255,255,255,0.4)',
        bgcolor: currentView === 'scanner' ? 'rgba(255,255,255,0.15)' : 'transparent',
        p: 1.5,
        borderRadius: 3,
      }}
    >
      <QrCodeScannerRounded sx={{ fontSize: 28 }} />
    </IconButton>
  </Box>
);