import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Button, Alert, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { CameraAltRounded } from '@mui/icons-material';

interface CameraCaptureSectionProps {
  aiReport: string;
  photoUrl: string;
  onPhotoSelected: (file: File) => void;
  onSubmitFinal: () => void;
  isSubmitting: boolean;
}

export const CameraCaptureSection: React.FC<CameraCaptureSectionProps> = ({
  aiReport,
  photoUrl,
  onPhotoSelected,
  onSubmitFinal,
  isSubmitting,
}) => (
  <CameraCaptureContent
    aiReport={aiReport}
    photoUrl={photoUrl}
    onPhotoSelected={onPhotoSelected}
    onSubmitFinal={onSubmitFinal}
    isSubmitting={isSubmitting}
  />
);

const CameraCaptureContent: React.FC<CameraCaptureSectionProps> = ({
  aiReport,
  photoUrl,
  onPhotoSelected,
  onSubmitFinal,
  isSubmitting,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setCameraError('No se pudo abrir la cámara. Verifica los permisos del navegador e inténtalo nuevamente.');
      }
    };

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Este navegador no permite acceder a la cámara.');
    } else {
      void startCamera();
    }

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const handleTakePhoto = () => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      setCameraError('La cámara todavía no está lista. Espera un momento e inténtalo nuevamente.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        onPhotoSelected(new File([blob], 'evidencia-zona.jpg', { type: 'image/jpeg' }));
      }
    }, 'image/jpeg', 0.9);
  };

  const handleSubmit = () => {
    if (photoUrl) {
      setConfirmationOpen(true);
    }
  };

  return (
    <Box 
      sx={{ 
        flex: 1, 
        minHeight: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: { xs: 1.5, sm: 2.5 }, 
        overflowY: 'auto', 
        px: { xs: 0.5, sm: 1 },
        py: 1,
        // Permitir scroll fluido y evitar rebotes molestos en mobile
        WebkitOverflowScrolling: 'touch' 
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          borderRadius: 4, 
          bgcolor: '#ffffff', 
          border: '1px solid #edf2f7', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center', 
          gap: { xs: 1.5, sm: 2 },
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <CameraAltRounded sx={{ fontSize: { xs: 42, sm: 54 }, color: '#3b82f6', mt: 0.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Evidencia Fotográfica Final
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
          Toma una foto de la zona limpia para validar el cumplimiento ante el administrador.
        </Typography>

        {aiReport && (
          <Alert severity="info" sx={{ width: '100%', textAlign: 'left', borderRadius: 3, mt: 0.5 }}>
            <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>Novedades del aseo:</Typography>
            {aiReport}
          </Alert>
        )}

        {cameraError && <Alert severity="error" sx={{ width: '100%', borderRadius: 3 }}>{cameraError}</Alert>}
        
        {/* Vista previa de la cámara en vivo adaptable */}
        <Box
          component="video"
          ref={videoRef}
          autoPlay
          muted
          playsInline
          sx={{ 
            width: '100%', 
            maxHeight: { xs: '220px', sm: '320px' }, 
            objectFit: 'cover', 
            borderRadius: 3, 
            bgcolor: '#0f172a' 
          }}
        />

        <Button 
          variant="outlined" 
          onClick={handleTakePhoto} 
          disabled={Boolean(cameraError)} 
          sx={{ borderRadius: 3, textTransform: 'none', width: { xs: '100%', sm: 'auto' } }}
        >
          Tomar foto con la cámara
        </Button>

        {/* Contenedor de la foto capturada */}
        <Box 
          sx={{ 
            width: '100%', 
            maxHeight: { xs: '200px', sm: '280px' }, 
            bgcolor: '#f1f5f9', 
            borderRadius: 3, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            border: '2px dashed #cbd5e1', 
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {photoUrl ? (
            <Box component="img" src={photoUrl} alt="Evidencia del aseo" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>No se ha seleccionado evidencia</Typography>
          )}
        </Box>

        {/* Botón final fijo/responsivo con margen inferior seguro para móviles */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleSubmit}
          disabled={isSubmitting || !photoUrl}
          sx={{ 
            mt: 2, 
            mb: 2,
            py: { xs: 1.2, sm: 1.5 }, 
            borderRadius: 3, 
            textTransform: 'none', 
            fontWeight: 600, 
            bgcolor: '#059669', 
            '&:hover': { bgcolor: '#047857' },
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)'
          }}
        >
          {isSubmitting ? 'Guardando reporte...' : 'Enviar reporte completo al administrador'}
        </Button>
      </Paper>

      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>¿Seguro que deseas enviar la foto?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Al confirmar se generará el reporte y finalizará el aseo.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmationOpen(false)} disabled={isSubmitting}>No, volver</Button>
          <Button
            variant="contained"
            onClick={() => {
              setConfirmationOpen(false);
              onSubmitFinal();
            }}
            disabled={isSubmitting}
          >
            Sí, enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};