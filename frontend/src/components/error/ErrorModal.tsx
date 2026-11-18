import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

interface ErrorModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ open, message, onClose }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle>Revisa los datos</DialogTitle>
    <DialogContent>
      <Typography color="text.secondary">{message}</Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} variant="contained" fullWidth>
        Entendido
      </Button>
    </DialogActions>
  </Dialog>
);
