import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function ProductsList() {
  const [produtos, setProdutos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');

  useEffect(() => {
    api.get('/produtos')
      .then(({ data }) => setProdutos(data))
      .catch(err => console.error(err));

    api.get('/grupos')
      .then(({ data }) => setGrupos(data))
      .catch(err => console.error(err));
  }, []);

  const filteredProducts = produtos.filter(p => {
    const matchName  = p.nome.toLowerCase().includes(nameFilter.toLowerCase());
    const matchGroup = !groupFilter || (p.grupo?._id === groupFilter);
    return matchName && matchGroup;
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Produtos</h1>

      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 16 }}>
          Nome:
          <input
            type="text"
            value={nameFilter}
            onChange={e => setNameFilter(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>
        <label>
          Grupo:
          <select
            value={groupFilter}
            onChange={e => setGroupFilter(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="">(todos)</option>
            {grupos.map(g => (
              <option key={g._id} value={g._id}>{g.nome}</option>
            ))}
          </select>
        </label>
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nome</th>
            <th>SKU</th>
            <th>Quantidade</th>
            <th>Unidade</th>
            <th>Grupo</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(p => (
            <tr key={p._id}>
              <td>{p.nome}</td>
              <td>{p.sku}</td>
              <td>{p.quantidade}</td>
              <td>{p.unidade}</td>
              <td>{p.grupo?.nome || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
