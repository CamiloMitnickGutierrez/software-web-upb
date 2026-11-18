import { axiosClient } from './axios.client';
import { useAuthStore } from '../store/use.AuthStore';

export interface CreateCleaningPayload {
  zone_id: number;
  duracion: string;
  novedad: string;
  foto: File;
}

export const createCleaning = (payload: CreateCleaningPayload) => {
  const token = useAuthStore.getState().token;

  if (!token) {
    throw new Error('Tu sesión ha expirado. Inicia sesión nuevamente.');
  }

  const formData = new FormData();
  formData.append('zone_id', String(payload.zone_id));
  formData.append('duracion', payload.duracion);
  formData.append('novedad', payload.novedad);
  formData.append('foto', payload.foto);

  return axiosClient.post('/api/cleanings', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
