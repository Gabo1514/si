import React, { useState } from 'react';
import ClienteForm from './components/ClienteForm.jsx';
import FacturaForm from './components/FacturaForm.jsx';
import FacturaList from './components/FacturaList.jsx';
import './styles/App.css';
import './styles/shared.css';

function App() {
  const [cliente, setCliente] = useState(null);
  const [facturas, setFacturas] = useState([]);

  const handleClienteRegistrado = (clienteData) => {
    setCliente(clienteData);
  };

  const handleFacturaCreada = (factura) => {
    setFacturas([...facturas, factura]);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sistema de Facturación Electrónica</h1>
        <p>Plataforma integral para la emisión y gestión de comprobantes de pago con validación automática de datos mediante RENIEC y SUNAT. Incluye conversión de divisas en tiempo real y cálculo automático de impuestos según normativa vigente.</p>
      </header>
      
      <main className="app-main">
        <section className="section-cliente">
          <ClienteForm onClienteRegistrado={handleClienteRegistrado} />
        </section>

        {cliente && (
          <section className="section-factura">
            <FacturaForm 
              cliente={cliente} 
              onFacturaCreada={handleFacturaCreada} 
            />
          </section>
        )}

        {facturas.length > 0 && (
          <section className="section-lista">
            <FacturaList facturas={facturas} />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
