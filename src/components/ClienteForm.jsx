import React, { useState } from 'react';
import { buscarDNI, buscarRUC } from '../services/api.js';
import '../styles/ClienteForm.css';
import '../styles/shared.css';

function ClienteForm({ onClienteRegistrado }) {
    const [tipoDoc, setTipoDoc] = useState('DNI');
    const [numeroDoc, setNumeroDoc] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleBuscar = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let clienteData;

            if (tipoDoc === 'DNI') {
                clienteData = await buscarDNI(numeroDoc);
            } else {
                clienteData = await buscarRUC(numeroDoc);
            }

            onClienteRegistrado({
                tipo: tipoDoc,
                numero: numeroDoc,
                ...clienteData
            });
        } catch (err) {
            setError(err.message || 'Error al buscar datos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cliente-form-container">
            <h2>Registrar Cliente</h2>
            <p className="section-description">
                Ingrese el número de DNI o RUC del cliente. El sistema validará automáticamente los datos con RENIEC y SUNAT para garantizar la información correcta en el comprobante.
            </p>

            <form onSubmit={handleBuscar} className="cliente-form">
                <div className="form-group">
                    <label htmlFor="tipoDoc">Tipo de Documento:</label>
                    <select
                        id="tipoDoc"
                        value={tipoDoc}
                        onChange={(e) => setTipoDoc(e.target.value)}
                        className="form-select"
                    >
                        <option value="DNI">DNI</option>
                        <option value="RUC">RUC</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="numeroDoc">Número de Documento:</label>
                    <input
                        id="numeroDoc"
                        type="text"
                        value={numeroDoc}
                        onChange={(e) => setNumeroDoc(e.target.value)}
                        placeholder={tipoDoc === 'DNI' ? '12345678' : '20123456789'}
                        maxLength={tipoDoc === 'DNI' ? 8 : 11}
                        required
                        className="form-input"
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading ? 'Buscando...' : 'Buscar Cliente'}
                </button>
            </form>
        </div>
    );
}

export default ClienteForm;
