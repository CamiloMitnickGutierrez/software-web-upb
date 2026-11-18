import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

interface ReportDialogsProps {
  selectedElement: string | null;
  confirmationOpen: boolean;
  reportOpen: boolean;
  description: string;
  isGenerating: boolean;
  getElementLabel: (element: string | null) => string;
  onCancelConfirmation: () => void;
  onConfirm: () => void;
  onCancelReport: () => void;
  onDescriptionChange: (description: string) => void;
  onGenerate: () => void;
}

export const ReportDialogs: React.FC<ReportDialogsProps> = ({
  selectedElement,
  confirmationOpen,
  reportOpen,
  description,
  isGenerating,
  getElementLabel,
  onCancelConfirmation,
  onConfirm,
  onCancelReport,
  onDescriptionChange,
  onGenerate,
}) => (
  <>
    <Dialog open={confirmationOpen} onClose={onCancelConfirmation} fullWidth maxWidth="xs">
      <DialogTitle>¿Estás seguro?</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">
          {selectedElement
            ? `Solo podrás reportar ${getElementLabel(selectedElement)} una vez durante este aseo.`
            : 'Solo podrás enviar una novedad general una vez durante este aseo.'}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancelConfirmation}>Cancelar</Button>
        <Button onClick={onConfirm} variant="contained">Continuar</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={reportOpen} onClose={onCancelReport} fullWidth maxWidth="xs">
      <DialogTitle>Reportar novedad</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {selectedElement ? `Describe qué encontraste en ${getElementLabel(selectedElement)}.` : 'Describe la novedad general del baño.'}
        </Typography>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={4}
          label="¿Qué encontraste?"
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancelReport} disabled={isGenerating}>Cancelar</Button>
        <Button onClick={onGenerate} variant="contained" disabled={!description.trim() || isGenerating}>
          {isGenerating ? 'Generando...' : 'Generar informe'}
        </Button>
      </DialogActions>
    </Dialog>
  </>
);
