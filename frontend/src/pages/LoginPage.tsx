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
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginSchema } from '../schemas/auth.Schemas';
import { axiosClient } from '../api/axios.client';
import { useAuthStore } from '../store/use.AuthStore';
import { getErrorMessage } from '../utils/error.handler';
import { PrivacyConsent } from '../components/privacy/PrivacyConsent';
import { ErrorModal } from '../components/error/ErrorModal';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { correo: '', clave: '', acceptedPrivacy: false },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setServerError(null);
      try {
        const response = await axiosClient.post('/api/auth/login', {
          correo: values.correo,
          clave: values.clave,
          acceptedPrivacy: values.acceptedPrivacy,
        });

        // Tu backend responde con { mensaje, data: { user, session } }
        const responseData = response.data.data || response.data;
        const user = responseData.user;
        const session = responseData.session || { access_token: responseData.token || responseData.access_token };

        if (!user || !session?.access_token) {
          throw new Error('La respuesta del servidor no contiene los datos de sesión esperados.');
        }

        setAuth(user, session.access_token);

        // Redirección exacta según el rol
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/operario');
        }
      } catch (err) {
        const message = getErrorMessage(err);
        setServerError(message);
        setErrorModalOpen(true);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 3 }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, width: '100%', borderRadius: 3, border: '1px solid #e0e0e0' }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 700 }}>
            Ruta Limpia UPB
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Ingresa a tu cuenta para continuar
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const errors = await formik.validateForm();
            formik.setTouched({ correo: true, clave: true, acceptedPrivacy: true });
            if (Object.keys(errors).length > 0) {
              setServerError('Verifica el correo, la contraseña y la aceptación de las políticas.');
              setErrorModalOpen(true);
              return;
            }
            await formik.submitForm();
          }}
          noValidate
        >
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
            type={showPassword ? 'text' : 'password'}
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
                  <IconButton aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} onClick={() => setShowPassword((visible) => !visible)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
            {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              ¿No tienes una cuenta?{' '}
              <Typography
                component={RouterLink}
                to="/register"
                variant="body2"
                color="primary"
                sx={{ textDecoration: 'none', fontWeight: 600 }}
              >
                Regístrate aquí
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