import { useState } from 'react';

const INITIAL_ELEMENTS: Record<string, boolean> = {
  'cabina-1': true,
  'cabina-2': true,
  'cabina-3': true,
  'cabina-4': true,
  lavamanos: true,
  'orinal-1': true,
  'orinal-2': true,
  'orinal-3': true,
  'orinal-4': true,
};

const getElementLabel = (element: string | null) => {
  if (!element) return 'novedad general';
  return element.replace('cabina-', 'cabina ').replace('orinal-', 'orinal ');
};

export const useInteractiveMap = (onReportCreated: (report: string, element: string | null) => void) => {
  const [elements] = useState(INITIAL_ELEMENTS);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [reportedElements, setReportedElements] = useState<Record<string, boolean>>({});
  const [generalReportSubmitted, setGeneralReportSubmitted] = useState(false);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);

  const openElementReport = (element: string) => {
    if (reportedElements[element]) return;
    setSelectedElement(element);
    setConfirmationDialogOpen(true);
  };

  const openGeneralReport = () => {
    if (generalReportSubmitted) return;
    setSelectedElement(null);
    setConfirmationDialogOpen(true);
  };

  const cancelConfirmation = () => {
    setSelectedElement(null);
    setConfirmationDialogOpen(false);
  };

  const confirmReport = () => {
    setDescription('');
    setConfirmationDialogOpen(false);
    setReportDialogOpen(true);
  };

  const cancelReport = () => {
    if (isGenerating) return;
    setSelectedElement(null);
    setDescription('');
    setReportDialogOpen(false);
  };

  const generateReport = () => {
    if (!description.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      onReportCreated(
        `Informe de novedad: ${getElementLabel(selectedElement)}. Descripción: ${description.trim()}.`,
        selectedElement,
      );

      if (selectedElement) {
        setReportedElements((previous) => ({ ...previous, [selectedElement]: true }));
      } else {
        setGeneralReportSubmitted(true);
      }

      setIsGenerating(false);
      setReportDialogOpen(false);
      setDescription('');
    }, 500);
  };

  return {
    elements,
    selectedElement,
    reportedElements,
    generalReportSubmitted,
    description,
    setDescription,
    isGenerating,
    reportDialogOpen,
    confirmationDialogOpen,
    openElementReport,
    openGeneralReport,
    cancelConfirmation,
    confirmReport,
    cancelReport,
    generateReport,
    getElementLabel,
    isElementReported: (element: string) => Boolean(reportedElements[element] || selectedElement === element),
    completedCount: Object.values(elements).filter(Boolean).length,
    totalElements: Object.keys(elements).length,
  };
};
