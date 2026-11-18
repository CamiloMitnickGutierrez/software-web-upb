import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { CheckCircleRounded } from '@mui/icons-material';
import { useInteractiveMap } from '../../hooks/useInteractiveMap';
import { BathroomMap } from './map/BathroomMap';
import { MapHeader } from './map/MapHeader';
import { ReportDialogs } from './map/ReportDialogs';

interface InteractiveMapSectionProps {
  scannedZone: string;
  formattedTime: string;
  onFinishCleaning: () => void;
  onReportCreated: (report: string, element: string | null) => void;
}

export const InteractiveMapSection: React.FC<InteractiveMapSectionProps> = ({
  scannedZone,
  formattedTime,
  onFinishCleaning,
  onReportCreated,
}) => {
  const map = useInteractiveMap(onReportCreated);

  return (
    <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2.5 }, overflow: 'hidden' }}>
      <MapHeader scannedZone={scannedZone} formattedTime={formattedTime} />
      <Box sx={{ px: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Plano interactivo del baño</Typography>
        <Typography variant="body2" color="text.secondary">
          Toca un elemento para reportar una novedad mientras continúas con el aseo. ({map.completedCount}/{map.totalElements} en proceso)
        </Typography>
      </Box>
      <BathroomMap
        isElementReported={map.isElementReported}
        onSelectElement={map.openElementReport}
        onGeneralReport={map.openGeneralReport}
        generalReportSubmitted={map.generalReportSubmitted}
      />
      <Tooltip title="Finalizar aseo">
        <IconButton
          onClick={onFinishCleaning}
          aria-label="Finalizar aseo"
          sx={{
            position: 'fixed',
            right: { xs: 24, sm: 40 },
            bottom: { xs: 120, sm: 136 },
            width: 72,
            height: 72,
            color: '#fff',
            bgcolor: '#16a34a',
            boxShadow: '0 10px 24px rgba(22, 163, 74, 0.35)',
            zIndex: 1100,
            '&:hover': { bgcolor: '#15803d', transform: 'scale(1.05)' },
            transition: 'transform 0.2s ease, background-color 0.2s ease',
          }}
        >
          <CheckCircleRounded sx={{ fontSize: 38 }} />
        </IconButton>
      </Tooltip>
      <ReportDialogs
        selectedElement={map.selectedElement}
        confirmationOpen={map.confirmationDialogOpen}
        reportOpen={map.reportDialogOpen}
        description={map.description}
        isGenerating={map.isGenerating}
        getElementLabel={map.getElementLabel}
        onCancelConfirmation={map.cancelConfirmation}
        onConfirm={map.confirmReport}
        onCancelReport={map.cancelReport}
        onDescriptionChange={map.setDescription}
        onGenerate={map.generateReport}
      />
    </Box>
  );
};
