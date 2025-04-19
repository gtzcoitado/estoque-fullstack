import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function GroupsList() {
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    api.get('/grupos')
      .then(res => setGrupos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Grupos</h1>
      <Link to="/grupos/novo">+ Novo Grupo</Link>
      <ul>
        {grupos.map(g => (
          <li key={g._id}>{g.nome}</li>
        ))}
      </ul>
    </div>
  );
}
