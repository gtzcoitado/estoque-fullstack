// frontend/web-estoque/src/components/AdjustmentsList.jsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function AdjustmentsList() {
  const [movs, setMovs] = useState([]);

  useEffect(() => {
    api.get('/movimentos')
      .then(res => setMovs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Ajustes de Estoque</h1>
      <Link to="/ajustes/novo">+ Novo Ajuste</Link>
      <table border="1" cellPadding="8" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Produto</th>
            <th>Tipo</th>
            <th>Quantidade</th>
            <th>Usuário</th>
          </tr>
        </thead>
        <tbody>
          {movs.map(m => (
            <tr key={m._id}>
              <td>{new Date(m.data).toLocaleString()}</td>
              <td>{m.produto?.nome || '—'}</td>
              <td>{m.tipo}</td>
              <td>{m.quantidade}</td>
              <td>{m.usuario || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
