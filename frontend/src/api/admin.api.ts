import { axiosClient } from './axios.client';

export interface AdminZone {
  id: number;
  nombre: string;
  estado: string;
  piso: string;
}

export interface AdminOperaria {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
}

export interface CleaningHistory {
  id: number | string;
  duracion: string;
  novedad: string;
  created_at?: string;
  zona: string;
  foto_url: string | null;
  foto_estado: 'Validada' | 'Rechazada';
  operaria: Pick<AdminOperaria, 'nombre' | 'apellido' | 'correo'> | null;
}

export interface AdminOverview {
  zones: AdminZone[];
  operarias: AdminOperaria[];
  history: CleaningHistory[];
}

export const getAdminOverview = async (): Promise<AdminOverview> => {
  const response = await axiosClient.get<AdminOverview>('/api/admin/overview');
  return response.data;
};
