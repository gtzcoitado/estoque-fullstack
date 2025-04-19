// frontend/web-estoque/src/components/AdjustmentForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function AdjustmentForm() {
  const [produtos, setProdutos] = useState([]);
  const [produtoId, setProdutoId] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [quantidade, setQuantidade] = useState(0);
  const [usuario, setUsuario] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/produtos')
      .then(res => setProdutos(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/movimentos', {
        produto: produtoId,
        tipo,
        quantidade,
        usuario
      });
      navigate('/ajustes');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar ajuste: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Novo Ajuste</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Produto:</label><br/>
          <select
            value={produtoId}
            onChange={e => setProdutoId(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {produtos.map(p => (
              <option key={p._id} value={p._id}>{p.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Tipo:</label><br/>
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>
        <div>
          <label>Quantidade:</label><br/>
          <input
            type="number"
            min="1"
            value={quantidade}
            onChange={e => setQuantidade(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Usuário:</label><br/>
          <input
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            placeholder="opcional"
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Salvar Ajuste</button>
      </form>
    </div>
  );
}
