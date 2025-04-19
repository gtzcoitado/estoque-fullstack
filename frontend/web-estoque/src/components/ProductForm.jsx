import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function ProductForm() {
  const [nome, setNome] = useState('');
  const [sku, setSku] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [unidade, setUnidade] = useState('');
  const [grupos, setGrupos] = useState([]);
  const [grupoId, setGrupoId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/grupos')
      .then(res => setGrupos(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // envia só grupoId se existir
      const payload = { nome, sku, quantidade, unidade };
      if (grupoId) payload.grupo = grupoId;
      await api.post('/produtos', payload);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar produto: ' + err.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Novo Produto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label><br/>
          <input value={nome} onChange={e => setNome(e.target.value)} required />
        </div>
        <div>
          <label>SKU:</label><br/>
          <input value={sku} onChange={e => setSku(e.target.value)} />
        </div>
        <div>
          <label>Quantidade:</label><br/>
          <input
            type="number"
            min="0"
            value={quantidade}
            onChange={e => setQuantidade(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Unidade:</label><br/>
          <input value={unidade} onChange={e => setUnidade(e.target.value)} />
        </div>
        <div>
          <label>Grupo:</label><br/>
          <select
            value={grupoId}
            onChange={e => setGrupoId(e.target.value)}
          >
            <option value="">(sem grupo)</option>
            {grupos.map(g => (
              <option key={g._id} value={g._id}>{g.nome}</option>
            ))}
          </select>
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Salvar</button>
      </form>
    </div>
  );
}
