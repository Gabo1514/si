import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const tipoCambio = response.data.rates.PEN || 3.75;
    
    res.json({ tipoCambio });
  } catch (error) {
    console.error('Error al obtener tipo de cambio:', error.message);
    res.json({ tipoCambio: 3.75 });
  }
});

export default router;
