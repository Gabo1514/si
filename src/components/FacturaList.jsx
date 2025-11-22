import React from 'react';
import jsPDF from 'jspdf';
import '../styles/FacturaList.css';
import '../styles/shared.css';

function FacturaList({ facturas }) {
  return (
    <div className="factura-list-container">
      <h2>Facturas Generadas</h2>
      <p className="section-description">
        Historial de comprobantes emitidos. Cada factura incluye la información completa del cliente, detalle de productos, cálculo de impuestos y monto total en soles.
      </p>
      
      <div className="facturas-grid">
        {facturas.map((factura) => (
          <div key={factura.id} className="factura-card">
            <div className="factura-header">
              <h3>Factura #{factura.id}</h3>
              <span className="factura-fecha">{factura.fecha}</span>
            </div>

            <div className="factura-cliente">
              <p><strong>Cliente:</strong> {factura.cliente.nombre || factura.cliente.razonSocial}</p>
              <p><strong>{factura.cliente.tipo}:</strong> {factura.cliente.numero}</p>
            </div>

            <div className="factura-productos">
              <h4>Productos:</h4>
              <ul>
                {factura.productos.map((prod, index) => (
                  <li key={index}>
                    {prod.descripcion} - {prod.cantidad} x {prod.moneda} {prod.precio.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="factura-totales">
              <div className="total-item">
                <span>Subtotal:</span>
                <span>S/ {factura.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-item">
                <span>IGV:</span>
                <span>S/ {factura.igv.toFixed(2)}</span>
              </div>
              <div className="total-item total-final">
                <span>Total:</span>
                <span>S/ {factura.total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => descargarFactura(factura)}
              className="btn-download"
            >
              Descargar PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const descargarFactura = (factura) => {
  const doc = new jsPDF();
  
  // Configuración
  const margen = 20;
  let y = 20;
  
  // Título
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURA ELECTRONICA', 105, y, { align: 'center' });
  
  y += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Factura N: ${factura.id}`, margen, y);
  doc.text(`Fecha: ${factura.fecha}`, 150, y);
  
  // Línea separadora
  y += 10;
  doc.setLineWidth(0.5);
  doc.line(margen, y, 190, y);
  
  // Datos del cliente
  y += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL CLIENTE', margen, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${factura.cliente.tipo}: ${factura.cliente.numero}`, margen, y);
  
  y += 6;
  doc.text(`Nombre: ${factura.cliente.nombre || factura.cliente.razonSocial}`, margen, y);
  
  // Línea separadora
  y += 10;
  doc.line(margen, y, 190, y);
  
  // Detalle de productos
  y += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLE DE PRODUCTOS/SERVICIOS', margen, y);
  
  y += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Descripcion', margen, y);
  doc.text('Cant.', 110, y);
  doc.text('P. Unit.', 135, y);
  doc.text('Subtotal', 165, y);
  
  y += 2;
  doc.setLineWidth(0.3);
  doc.line(margen, y, 190, y);
  
  y += 6;
  doc.setFont('helvetica', 'normal');
  
  factura.productos.forEach((prod) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    
    doc.text(prod.descripcion.substring(0, 40), margen, y);
    doc.text(prod.cantidad.toString(), 110, y);
    doc.text(`${prod.moneda} ${prod.precio.toFixed(2)}`, 135, y);
    doc.text(`S/ ${prod.subtotal.toFixed(2)}`, 165, y);
    y += 6;
  });
  
  // Línea separadora
  y += 5;
  doc.setLineWidth(0.5);
  doc.line(margen, y, 190, y);
  
  // Totales
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 135, y);
  doc.text(`S/ ${factura.subtotal.toFixed(2)}`, 165, y);
  
  y += 6;
  doc.text('IGV (18%):', 135, y);
  doc.text(`S/ ${factura.igv.toFixed(2)}`, 165, y);
  
  // Línea antes del total
  y += 8;
  doc.setLineWidth(0.8);
  doc.line(130, y, 190, y);
  
  // Total a pagar con más espacio
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TOTAL A PAGAR:', 120, y);
  doc.text(`S/ ${factura.total.toFixed(2)}`, 170, y);
  
  // Pie de página
  y += 20;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Gracias por su preferencia', 105, y, { align: 'center' });
  doc.text('Sistema de Facturacion Electronica', 105, y + 5, { align: 'center' });
  
  // Guardar PDF
  doc.save(`Factura_${factura.id}_${factura.cliente.numero}.pdf`);
};

export default FacturaList;
