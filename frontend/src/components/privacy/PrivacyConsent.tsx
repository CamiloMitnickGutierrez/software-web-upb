import React from 'react';
import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material';

interface PrivacyConsentProps {
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
  onBlur: () => void;
}

export const PrivacyConsent: React.FC<PrivacyConsentProps> = ({
  checked,
  error,
  onChange,
  onBlur,
}) => (
  <>
    <FormControlLabel
      control={
        <Checkbox
          name="acceptedPrivacy"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          onBlur={onBlur}
        />
      }
      label="Acepto las políticas de privacidad"
    />
    {error && <FormHelperText error>{error}</FormHelperText>}
  </>
);
