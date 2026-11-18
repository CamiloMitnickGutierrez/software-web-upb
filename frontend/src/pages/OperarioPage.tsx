import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Alert } from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/use.AuthStore';
import { useNavigate } from 'react-router-dom';

// Importar los componentes modulares de la carpeta operario
import { OperarioHeader } from '../components/operario/OperarioHeader';
import { OperarioBottomNav } from '../components/operario/OperarioBottomNav';
import { HomeSection } from '../components/operario/HomeSection';
import { ScannerSection } from '../components/operario/ScannerSection';
import { CameraCaptureSection } from '../components/operario/CamaraCaptureSection';
import { InteractiveMapSection } from '../components/operario/interactiveMapSection';
import { createCleaning } from '../api/cleanings.api';
import { getErrorMessage } from '../utils/error.handler';
import { getZoneByQr, type Zone } from '../api/zones.api';

// Inicializar socket conectado al backend en Azure
const socket: Socket = io(import.meta.env.VITE_API_URL || 'https://rutalimpia-api-camilo.azurewebsites.net', {
  autoConnect: false,
  reconnection: false,
  timeout: 5000,
});

export const OperarioPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'scanner' | 'map' | 'camera'>('home');
  const [scannedZone, setScannedZone] = useState<string>('');
  const [zone, setZone] = useState<Zone | null>(null);
  
  // Cronómetro
  const [seconds, setSeconds] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const [aiReport, setAiReport] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanRetry, setScanRetry] = useState(0);
  const validatingQr = useRef(false);
  const socketConnectionAttempted = useRef(false);

  // Historial reciente para el Home
  const [lastCleaning, setLastCleaning] = useState<{ zone: string; time: string; date: string } | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  useEffect(() => () => {
    socket.disconnect();
  }, []);

  // Lógica del Cronómetro en vivo
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Manejo de la cámara y escáner QR real
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (currentView === 'scanner') {
      scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      scanner.render(
        async (decodedText) => {
          if (validatingQr.current) return;
          validatingQr.current = true;
          setScanError(null);

          if (scanner) {
            scanner.clear().catch((err) => console.error(err));
          }

          try {
            const validatedZone = await getZoneByQr(decodedText.trim());
            setZone(validatedZone);
            setScannedZone(validatedZone.nombre);
            if (!socketConnectionAttempted.current) {
              socketConnectionAttempted.current = true;
              socket.connect();
            }
            socket.emit('cleaning:start', { zone_id: validatedZone.id, zone: validatedZone.nombre, operario: user?.nombre, started_at: Date.now() });
            setSeconds(0);
            setTimerActive(true);
            validatingQr.current = false;
            setCurrentView('map');
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              setScanError('Este código QR no está registrado en el sistema.');
            } else {
              setScanError('No se pudo validar el código QR. Revisa tu conexión e inténtalo nuevamente.');
            }
            validatingQr.current = false;
          }
        },
        () => {
          // La cámara revisa muchos frames antes de encontrar un QR.
        }
      );
    }
    return () => {
      if (scanner) {
        scanner.clear().catch((err) => console.error(err));
      }
    };
  }, [currentView, user, scanRetry]);

  const handleReportCreated = (report: string, element: string | null) => {
    setAiReport((previousReport) => (
      previousReport ? `${previousReport}\n${report}` : report
    ));
    if (zone) {
      socket.emit('cleaning:novelty', {
        zone_id: zone.id,
        zone: zone.nombre,
        element,
        novelty: report,
      });
    }
  };

  // Envío final de los datos al backend/admin
  const handleFinalSubmit = async () => {
    const totalTimeFormatted = formatTime(seconds);

    if (!zone) {
      setSubmitError('No se pudo identificar el ID de la zona. Escanea nuevamente el código del baño.');
      return;
    }

    if (!photoFile) {
      setSubmitError('Toma una foto de evidencia antes de enviar el reporte.');
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await createCleaning({
        zone_id: zone.id,
        duracion: totalTimeFormatted,
        novedad: aiReport || 'Sin novedades',
        foto: photoFile,
      });

    socket.emit('cleaning:finished', {
      zone_id: zone.id,
      zone: scannedZone,
      operario: `${user?.nombre} ${user?.apellido}`,
      duration: totalTimeFormatted,
      novelty: aiReport || 'Sin novedades',
      status: 'completed',
    });

      setLastCleaning({
        zone: scannedZone || 'Baño Bloque M - Piso 2',
        time: totalTimeFormatted,
        date: new Date().toLocaleDateString(),
      });

      setSuccessMsg('¡Aseo guardado correctamente!');
      setTimeout(() => setSuccessMsg(null), 3000);
      setTimerActive(false);
      setSeconds(0);
      setAiReport('');
      setPhotoUrl('');
      setPhotoFile(null);
      setZone(null);
      setCurrentView('home');
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoSelected = (file: File) => {
    setPhotoFile(file);
    setPhotoUrl((previousUrl) => {
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      return URL.createObjectURL(file);
    });
  };

  const handleLogout = () => {
    socket.disconnect();
    logout();
    navigate('/login');
  };

  const handleBack = () => {
    if (currentView === 'scanner') {
      setScanError(null);
      setCurrentView('home');
    } else if (currentView === 'map') {
      setTimerActive(false);
      setCurrentView('home');
    } else if (currentView === 'camera') {
      setCurrentView('map');
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', height: '100dvh', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Container maxWidth="sm" sx={{ flex: 1, minHeight: 0, width: '100%', pt: { xs: 1.5, sm: 3 }, pb: { xs: 1, sm: 2 }, px: { xs: 1.5, sm: 2 }, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Cabecera común */}
        <OperarioHeader
          user={user}
          onLogout={handleLogout}
          showBack={currentView !== 'home'}
          onBack={handleBack}
        />

        {successMsg && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
            {successMsg}
          </Alert>
        )}
        {submitError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
            {submitError}
          </Alert>
        )}

        {/* Renderizado condicional según la vista actual */}
        {currentView === 'home' && (
          <HomeSection onStartScan={() => setCurrentView('scanner')} lastCleaning={lastCleaning} />
        )}

        {currentView === 'scanner' && (
          <ScannerSection
            error={scanError}
            onRetry={() => {
              setScanError(null);
              setScanRetry((previous) => previous + 1);
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'map' && (
          <InteractiveMapSection
            scannedZone={scannedZone}
            formattedTime={formatTime(seconds)}
            onFinishCleaning={() => {
              setTimerActive(false);
              setCurrentView('camera');
            }}
            onReportCreated={handleReportCreated}
          />
        )}

        {currentView === 'camera' && (
          <CameraCaptureSection
            aiReport={aiReport}
            photoUrl={photoUrl}
            onPhotoSelected={handlePhotoSelected}
            onSubmitFinal={handleFinalSubmit}
            isSubmitting={isSubmitting}
          />
        )}

      </Container>

      {/* Barra de navegación inferior flotante */}
      <OperarioBottomNav currentView={currentView} onNavigate={(view) => setCurrentView(view)} />
    </Box>
  );
};