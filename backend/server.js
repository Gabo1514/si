import express from 'express';
import https from 'https';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DECOLECTA_TOKEN = 'sk_11833.9we1rdmViLnaehmeNq1kklXT6RRHymsK';

// =====================================
//      RUTA PARA CONSULTAR DNI
// =====================================
app.get('/api/reniec/:dni', (req, res) => {
  const { dni } = req.params;

  if (!/^\d{8}$/.test(dni)) {
    return res.status(400).json({ message: 'El DNI debe tener 8 dígitos numéricos' });
  }

  const options = {
    hostname: 'api.decolecta.com',
    path: `/v1/reniec/dni/${dni}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${DECOLECTA_TOKEN}`,
      'Accept': 'application/json'
    }
  };

  const request = https.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      console.log(`Status: ${response.statusCode}, Data: ${data}`);
      try {
        const jsonData = JSON.parse(data);
        
        if (response.statusCode === 200 && jsonData.success && jsonData.data) {
          const persona = jsonData.data;
          res.json({
            dni,
            nombre: `${persona.nombres} ${persona.apellido_paterno} ${persona.apellido_materno}`,
            nombres: persona.nombres,
            apellidoPaterno: persona.apellido_paterno,
            apellidoMaterno: persona.apellido_materno
          });
        } else {
          console.error('ERROR DNI:', jsonData);
          res.status(404).json({ 
            message: jsonData.message || 'DNI no encontrado en RENIEC'
          });
        }
      } catch (error) {
        console.error('Error parsing:', error.message, data);
        res.status(500).json({ message: 'Error al procesar respuesta' });
      }
    });
  });

  request.on('error', (error) => {
    console.error('Error request:', error.message);
    res.status(500).json({ message: 'Error al consultar RENIEC' });
  });

  request.end();
});

// =====================================
//      RUTA PARA CONSULTAR RUC
// =====================================
app.get('/api/sunat/:ruc', (req, res) => {
  const { ruc } = req.params;

  if (!/^\d{11}$/.test(ruc)) {
    return res.status(400).json({ message: 'El RUC debe tener 11 dígitos numéricos' });
  }

  const options = {
    hostname: 'api.decolecta.com',
    path: `/v1/sunat/ruc/${ruc}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${DECOLECTA_TOKEN}`,
      'Accept': 'application/json'
    }
  };

  const request = https.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        
        if (response.statusCode === 200 && jsonData.success && jsonData.data) {
          const empresa = jsonData.data;
          res.json({
            ruc,
            razonSocial: empresa.razon_social || empresa.nombre_o_razon_social,
            direccion: empresa.direccion_completa || empresa.direccion || 'No disponible',
            estado: empresa.estado || 'ACTIVO',
            condicion: empresa.condicion || 'HABIDO'
          });
        } else {
          res.status(404).json({ 
            message: jsonData.message || 'RUC no encontrado en SUNAT'
          });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error al procesar respuesta' });
      }
    });
  });

  request.on('error', () => {
    res.status(500).json({ message: 'Error al consultar SUNAT' });
  });

  request.end();
});

// =====================================
//      RUTA PARA TIPO DE CAMBIO
// =====================================
app.get('/api/tipo-cambio', (req, res) => {
  const options = {
    hostname: 'api.exchangerate-api.com',
    path: '/v4/latest/USD',
    method: 'GET'
  };

  const request = https.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        const tipoCambio = jsonData.rates.PEN || 3.75;
        res.json({ tipoCambio });
      } catch (error) {
        res.json({ tipoCambio: 3.75 });
      }
    });
  });

  request.on('error', () => {
    res.json({ tipoCambio: 3.75 });
  });

  request.end();
});

// =====================================
//      HEALTH CHECK
// =====================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API funcionando',
    provider: 'DECOLECTA'
  });
});

// =====================================
//      INICIO DEL SERVIDOR
// =====================================
app.listen(PORT, () => {
  console.log(`\n✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`✅ Usando DECOLECTA API`);
  console.log(`\n💡 Prueba con cualquier DNI o RUC real\n`);
});
