import { axiosClient } from './axios.client';
import { useAuthStore } from '../store/use.AuthStore';

export interface Zone {
  id: number;
  nombre: string;
  codigo_qr: string;
  estado: string;
}

const getQrValue = (value: string): string => {
  try {
    const url = new URL(value);
    const segments = url.pathname.split('/').filter(Boolean);
    return segments.at(-1) || value;
  } catch {
    return value.trim();
  }
};

export const getZoneByQr = async (qrScannedText: string): Promise<Zone> => {
  const token = useAuthStore.getState().token;

  if (!token) {
    throw new Error('Tu sesión ha expirado. Inicia sesión nuevamente.');
  }

  const qrValue = getQrValue(qrScannedText);
  const response = await axiosClient.get(`/api/zones/${encodeURIComponent(qrValue)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = response.data?.data ?? response.data;

  return {
    id: Number(data.id),
    nombre: String(data.nombre),
    codigo_qr: String(data.codigo_qr),
    estado: String(data.estado),
  };
};
