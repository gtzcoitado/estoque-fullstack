import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function GroupForm() {
  const [nome, setNome] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/grupos', { nome });
      navigate('/grupos');
    } catch (err) {
      console.error(err);
      alert('Erro ao criar grupo');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Novo Grupo</h1>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label><br/>
        <input
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />
        <br/>
        <button style={{ marginTop: 10 }}>Salvar Grupo</button>
      </form>
    </div>
  );
}
