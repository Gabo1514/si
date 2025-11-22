import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://si-2.onrender.com/api';

export const buscarDNI = async (dni) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reniec/${dni}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al buscar DNI');
  }
};

export const buscarRUC = async (ruc) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sunat/${ruc}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al buscar RUC');
  }
};

export const obtenerTipoCambio = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tipo-cambio`);
    return response.data.tipoCambio;
  } catch (error) {
    console.error('Error al obtener tipo de cambio:', error);
    return 3.75;
  }
};
