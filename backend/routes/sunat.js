import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/:ruc', async (req, res) => {
  try {
    const { ruc } = req.params;

    if (!/^\d{11}$/.test(ruc)) {
      return res.status(400).json({ message: 'El RUC debe tener 11 dígitos numéricos' });
    }

    const response = await axios.get(`https://api.apis.net.pe/v2/sunat/ruc?numero=${ruc}`, {
      headers: {
        'Authorization': 'Bearer apis-token-10359.Ov0Ey1Ij0Tz3Xt5Uw8Yz',
        'Accept': 'application/json'
      }
    });

    const data = response.data;

    if (!data.razonSocial && !data.nombre) {
      return res.status(404).json({ message: 'RUC no encontrado en SUNAT' });
    }

    res.json({
      ruc: ruc,
      razonSocial: data.razonSocial || data.nombre,
      direccion: data.direccion || 'No disponible',
      estado: data.estado || 'ACTIVO',
      condicion: data.condicion || 'HABIDO'
    });

  } catch (error) {
    console.error('Error consultando RUC:', error.response?.data || error.message);
    return res.status(500).json({ 
      message: 'Error consultando SUNAT',
      detalle: error.response?.data || error.message
    });
  }
});

export default router;
