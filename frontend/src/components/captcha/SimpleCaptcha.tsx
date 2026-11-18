import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';

interface SimpleCaptchaProps {
  onValidate: (isValid: boolean) => void;
}

const firstNumber = Math.floor(Math.random() * 8) + 2;
const secondNumber = Math.floor(Math.random() * 8) + 2;

export const SimpleCaptcha: React.FC<SimpleCaptchaProps> = ({ onValidate }) => {
  const [answer, setAnswer] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setAnswer(value);
    onValidate(Number(value) === firstNumber + secondNumber);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Resuelve la validación: ¿cuánto es {firstNumber} + {secondNumber}?
      </Typography>
      <TextField
        fullWidth
        size="small"
        label="Respuesta"
        value={answer}
        onChange={handleChange}
        slotProps={{ htmlInput: { inputMode: 'numeric' } }}
        sx={{ mt: 1 }}
      />
    </Box>
  );
};
