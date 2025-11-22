import React, { useState, useEffect } from 'react';
import { obtenerTipoCambio } from '../services/api.js';
import '../styles/FacturaForm.css';
import '../styles/shared.css';

function FacturaForm({ cliente, onFacturaCreada }) {
  const [productos, setProductos] = useState([]);
  const [productoActual, setProductoActual] = useState({
    descripcion: '',
    cantidad: 1,
    precio: 0,
    moneda: 'PEN'
  });
  const [tipoCambio, setTipoCambio] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarTipoCambio();
  }, []);

  const cargarTipoCambio = async () => {
    try {
      const tc = await obtenerTipoCambio();
      setTipoCambio(tc);
    } catch (error) {
      console.error('Error al obtener tipo de cambio:', error);
    }
  };

  const agregarProducto = (e) => {
    e.preventDefault();
    
    if (!productoActual.descripcion || productoActual.precio <= 0) {
      return;
    }

    const precioEnSoles = productoActual.moneda === 'USD' && tipoCambio
      ? productoActual.precio * tipoCambio
      : productoActual.precio;

    const nuevoProducto = {
      ...productoActual,
      precioEnSoles,
      subtotal: precioEnSoles * productoActual.cantidad
    };

    setProductos([...productos, nuevoProducto]);
    setProductoActual({
      descripcion: '',
      cantidad: 1,
      precio: 0,
      moneda: 'PEN'
    });
  };

  const eliminarProducto = (index) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const calcularTotales = () => {
    const subtotal = productos.reduce((sum, p) => sum + p.subtotal, 0);
    const igv = subtotal * 0.18;
    const total = subtotal + igv;
    return { subtotal, igv, total };
  };

  const generarFactura = () => {
    const { subtotal, igv, total } = calcularTotales();
    
    const factura = {
      id: Date.now(),
      fecha: new Date().toLocaleString('es-PE'),
      cliente,
      productos,
      subtotal,
      igv,
      total
    };

    onFacturaCreada(factura);
    setProductos([]);
  };

  const { subtotal, igv, total } = calcularTotales();

  return (
    <div className="factura-form-container">
      <h2>Crear Factura</h2>
      <p className="section-description">
        Agregue los productos o servicios a facturar. El sistema calculará automáticamente el IGV (18%) y el total. Puede registrar importes en dólares que serán convertidos a soles según el tipo de cambio actual.
      </p>
      
      <div className="cliente-info">
        <h3>Cliente:</h3>
        <p><strong>{cliente.tipo}:</strong> {cliente.numero}</p>
        <p><strong>Nombre:</strong> {cliente.nombre || cliente.razonSocial}</p>
      </div>

      {tipoCambio && (
        <div className="tipo-cambio-info">
          <p>Tipo de cambio: S/ {tipoCambio.toFixed(2)} por USD</p>
        </div>
      )}

      <form onSubmit={agregarProducto} className="producto-form">
        <h3>Agregar Producto</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <input
              id="descripcion"
              type="text"
              value={productoActual.descripcion}
              onChange={(e) => setProductoActual({...productoActual, descripcion: e.target.value})}
              placeholder="Nombre del producto"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cantidad">Cantidad:</label>
            <input
              id="cantidad"
              type="number"
              min="1"
              value={productoActual.cantidad}
              onChange={(e) => setProductoActual({...productoActual, cantidad: parseInt(e.target.value)})}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="precio">Precio:</label>
            <input
              id="precio"
              type="number"
              step="0.01"
              min="0"
              value={productoActual.precio}
              onChange={(e) => setProductoActual({...productoActual, precio: parseFloat(e.target.value)})}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="moneda">Moneda:</label>
            <select
              id="moneda"
              value={productoActual.moneda}
              onChange={(e) => setProductoActual({...productoActual, moneda: e.target.value})}
              className="form-select"
            >
              <option value="PEN">Soles (S/)</option>
              <option value="USD">Dólares ($)</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn-secondary">
          Agregar Producto
        </button>
      </form>

      {productos.length > 0 && (
        <div className="productos-lista">
          <h3>Productos Agregados</h3>
          <table className="productos-table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Moneda</th>
                <th>Subtotal (S/)</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod, index) => (
                <tr key={index}>
                  <td>{prod.descripcion}</td>
                  <td>{prod.cantidad}</td>
                  <td>{prod.precio.toFixed(2)}</td>
                  <td>{prod.moneda}</td>
                  <td>S/ {prod.subtotal.toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => eliminarProducto(index)}
                      className="btn-delete"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="totales">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>IGV (18%):</span>
              <span>S/ {igv.toFixed(2)}</span>
            </div>
            <div className="total-row total-final">
              <span>Total:</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={generarFactura}
            className="btn-primary"
          >
            Generar Factura
          </button>
        </div>
      )}
    </div>
  );
}

export default FacturaForm;
