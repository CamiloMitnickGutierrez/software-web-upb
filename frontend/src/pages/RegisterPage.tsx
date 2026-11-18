import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerSchema } from '../schemas/auth.Schemas';
import { axiosClient } from '../api/axios.client';
import { getErrorMessage } from '../utils/error.handler';
import { PrivacyConsent } from '../components/privacy/PrivacyConsent';
import { SimpleCaptcha } from '../components/captcha/SimpleCaptcha';
import { ErrorModal } from '../components/error/ErrorModal';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({ clave: false, repetirClave: false });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      correo: '',
      clave: '',
      repetirClave: '',
      acceptedPrivacy: false,
      captchaValid: false,
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      setSuccessMessage(null);
      try {
        await axiosClient.post('/api/auth/registro', {
          nombre: values.nombre,
          apellido: values.apellido,
          correo: values.correo,
          clave: values.clave,
          repetirClave: values.repetirClave,
          acceptedPrivacy: values.acceptedPrivacy,
        });

        setSuccessMessage('¡Registro exitoso! Redirigiendo al login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (err) {
        const message = getErrorMessage(err);
        setServerError(message);
        setErrorModalOpen(true);
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 3 }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, width: '100%', borderRadius: 3, border: '1px solid #e0e0e0' }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
            Registro de Cuenta
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            CleanTrack UPB
          </Typography>
        </Box>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const errors = await formik.validateForm();
            formik.setTouched({
              nombre: true,
              apellido: true,
              correo: true,
              clave: true,
              repetirClave: true,
              acceptedPrivacy: true,
              captchaValid: true,
            });
            if (Object.keys(errors).length > 0) {
              setServerError('Verifica que los datos coincidan y completa todos los campos.');
              setErrorModalOpen(true);
              return;
            }
            await formik.submitForm();
          }}
          noValidate
        >
          <TextField
            fullWidth
            id="nombre"
            name="nombre"
            label="Nombre"
            margin="normal"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
            helperText={formik.touched.nombre && formik.errors.nombre}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            id="apellido"
            name="apellido"
            label="Apellido"
            margin="normal"
            value={formik.values.apellido}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.apellido && Boolean(formik.errors.apellido)}
            helperText={formik.touched.apellido && formik.errors.apellido}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            id="correo"
            name="correo"
            label="Correo electrónico"
            margin="normal"
            value={formik.values.correo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.correo && Boolean(formik.errors.correo)}
            helperText={formik.touched.correo && formik.errors.correo}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            id="clave"
            name="clave"
            label="Contraseña"
            type={visiblePasswords.clave ? 'text' : 'password'}
            margin="normal"
            value={formik.values.clave}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.clave && Boolean(formik.errors.clave)}
            helperText={formik.touched.clave && formik.errors.clave}
            slotProps={{
              input: {
                endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label={visiblePasswords.clave ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setVisiblePasswords((current) => ({ ...current, clave: !current.clave }))} edge="end">
                    {visiblePasswords.clave ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
                ),
              },
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            id="repetirClave"
            name="repetirClave"
            label="Confirmar contraseña"
            type={visiblePasswords.repetirClave ? 'text' : 'password'}
            margin="normal"
            value={formik.values.repetirClave}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.repetirClave && Boolean(formik.errors.repetirClave)}
            helperText={formik.touched.repetirClave && formik.errors.repetirClave}
            slotProps={{
              input: {
                endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label={visiblePasswords.repetirClave ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setVisiblePasswords((current) => ({ ...current, repetirClave: !current.repetirClave }))} edge="end">
                    {visiblePasswords.repetirClave ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
                ),
              },
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <PrivacyConsent
            checked={formik.values.acceptedPrivacy}
            error={formik.touched.acceptedPrivacy ? formik.errors.acceptedPrivacy : undefined}
            onChange={(checked) => formik.setFieldValue('acceptedPrivacy', checked)}
            onBlur={() => formik.setFieldTouched('acceptedPrivacy', true)}
          />

          <SimpleCaptcha
            onValidate={(isValid) => {
              formik.setFieldValue('captchaValid', isValid);
              formik.setFieldTouched('captchaValid', true);
            }}
          />
          {formik.touched.captchaValid && formik.errors.captchaValid && (
            <Typography variant="caption" color="error">
              {formik.errors.captchaValid}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={formik.isSubmitting}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              ¿Ya tienes una cuenta?{' '}
              <Typography
                component={RouterLink}
                to="/login"
                variant="body2"
                color="primary"
                sx={{ textDecoration: 'none', fontWeight: 600 }}
              >
                Inicia sesión
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Paper>
      <ErrorModal
        open={errorModalOpen}
        message={serverError || 'Verifica los datos ingresados e inténtalo nuevamente.'}
        onClose={() => setErrorModalOpen(false)}
      />
    </Container>
  );
};