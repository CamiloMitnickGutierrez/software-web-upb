import React from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { CheckCircleOutlined } from '@mui/icons-material';
import { MapLegend } from './MapLegend';

interface BathroomMapProps {
  isElementReported: (element: string) => boolean;
  onSelectElement?: (element: string) => void;
  onGeneralReport?: () => void;
  generalReportSubmitted?: boolean;
  readOnly?: boolean;
  status?: 'pending' | 'in_progress' | 'completed' | 'issue';
  elementStatuses?: Record<string, 'issue'>;
  onReadOnlySelect?: (element: string) => void;
  generalNovelty?: boolean;
}

const elementStyle = (reported: boolean, status?: BathroomMapProps['status']) => {
  if (status === 'issue') return { bgcolor: '#fee2e2', border: '2px solid #dc2626', color: '#b91c1c' };
  if (status === 'in_progress') return { bgcolor: '#fef3c7', border: '2px solid #f59e0b', color: '#b45309' };
  if (status === 'completed') return { bgcolor: '#dcfce7', border: '2px solid #16a34a', color: '#15803d' };
  if (status === 'pending') return { bgcolor: '#f3f4f6', border: '2px solid #9ca3af', color: '#4b5563' };
  return {
    bgcolor: reported ? '#fee2e2' : '#eff6ff',
    border: reported ? '2px solid #dc2626' : '2px solid #3b82f6',
    color: reported ? '#b91c1c' : '#1d4ed8',
  };
};

export const BathroomMap: React.FC<BathroomMapProps> = ({
  isElementReported,
  onSelectElement,
  onGeneralReport,
  generalReportSubmitted,
  readOnly = false,
  status,
  elementStatuses,
  onReadOnlySelect,
  generalNovelty = false,
}) => (
  <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 3 }, borderRadius: 4, bgcolor: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 }, minWidth: 0, overflow: 'visible' }}>
    <MapLegend />
    {readOnly && generalNovelty && (
      <Box onClick={() => onReadOnlySelect?.('general')} sx={{ p: 1.5, borderRadius: 2, cursor: 'pointer', bgcolor: '#fee2e2', border: '2px solid #dc2626', color: '#b91c1c', textAlign: 'center', fontWeight: 700 }}>
        Novedad general del baño
      </Box>
    )}
    <Box>
      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>CABINAS DE SANITARIOS</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: { xs: 0.75, sm: 1.5 } }}>
        {[1, 2, 3, 4].map((number) => {
          const element = `cabina-${number}`;
          const reported = isElementReported(element);
          const elementStatus = elementStatuses?.[element] || status;
          return (
            <Box key={element} onClick={() => readOnly ? onReadOnlySelect?.(element) : onSelectElement?.(element)} sx={{ p: 1.5, borderRadius: 3, cursor: 'pointer', textAlign: 'center', ...elementStyle(reported, elementStatus), '&:hover': { bgcolor: readOnly ? undefined : reported ? '#fecaca' : '#dbeafe' } }}>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Cabina {number}</Typography>
              <CheckCircleOutlined sx={{ fontSize: 18, mt: 0.5, color: reported ? '#dc2626' : '#3b82f6' }} />
            </Box>
          );
        })}
      </Box>
    </Box>

    <Box onClick={() => readOnly ? onReadOnlySelect?.('lavamanos') : onSelectElement?.('lavamanos')} sx={{ p: 2, borderRadius: 3, textAlign: 'center', cursor: 'pointer', ...elementStyle(isElementReported('lavamanos'), elementStatuses?.lavamanos || status), '&:hover': { bgcolor: readOnly ? undefined : isElementReported('lavamanos') ? '#fecaca' : '#dbeafe' } }}>
      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>MESA DE LAVAMANOS</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2.5 }}>
        {[1, 2, 3, 4].map((number) => <Box key={number} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: elementStatuses?.lavamanos ? '#dc2626' : status === 'in_progress' ? '#f59e0b' : status === 'completed' ? '#16a34a' : status === 'pending' ? '#9ca3af' : isElementReported('lavamanos') ? '#dc2626' : '#3b82f6' }} />)}
      </Box>
      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
        {isElementReported('lavamanos') ? 'Novedad en lavamanos' : 'Lavamanos en proceso'}
      </Typography>
    </Box>

    <Box>
      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', mb: 1, display: 'block' }}>ORINALES</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: { xs: 0.75, sm: 1 } }}>
        {[1, 2, 3, 4].map((number) => {
          const element = `orinal-${number}`;
          const reported = isElementReported(element);
          return (
            <Box key={element} onClick={() => readOnly ? onReadOnlySelect?.(element) : onSelectElement?.(element)} sx={{ p: 1.2, borderRadius: 2, textAlign: 'center', cursor: 'pointer', ...elementStyle(reported, elementStatuses?.[element] || status) }}>
              <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 700 }}>Orinal {number}</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>

    {!readOnly && (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="outlined" onClick={onGeneralReport} disabled={generalReportSubmitted} sx={{ borderRadius: 3, textTransform: 'none' }}>
          Reportar una novedad general
        </Button>
      </Box>
    )}
  </Paper>
);
