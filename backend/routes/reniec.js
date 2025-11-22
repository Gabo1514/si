import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/:dni', async (req, res) => {
  try {
    const { dni } = req.params;

    if (!/^\d{8}$/.test(dni)) {
      return res.status(400).json({ message: 'El DNI debe tener 8 dígitos numéricos' });
    }

    const response = await axios.get(`https://api.apis.net.pe/v2/reniec/dni?numero=${dni}`, {
      headers: {
        'Authorization': 'Bearer apis-token-10359.Ov0Ey1Ij0Tz3Xt5Uw8Yz',
        'Accept': 'application/json'
      }
    });

    const data = response.data;

    if (!data.nombres) {
      return res.status(404).json({ message: 'DNI no encontrado en RENIEC' });
    }

    res.json({
      dni: dni,
      nombre: `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
      nombres: data.nombres,
      apellidoPaterno: data.apellidoPaterno,
      apellidoMaterno: data.apellidoMaterno
    });

  } catch (error) {
    console.error('Error consultando DNI:', error.response?.data || error.message);
    return res.status(500).json({ 
      message: 'Error consultando RENIEC',
      detalle: error.response?.data || error.message
    });
  }
});

export default router;
