import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProductsList from './components/ProductsList';
import ProductForm from './components/ProductForm';
import GroupsList from './components/GroupsList';
import GroupForm from './components/GroupForm';
import AdjustmentsList from './components/AdjustmentsList';
import AdjustmentForm  from './components/AdjustmentForm';


function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 10, background: '#eee' }}>
        <Link to="/" style={{ marginRight: 10 }}>Produtos</Link>
        <Link to="/novo" style={{ marginRight: 10 }}>+ Produto</Link>
        <Link to="/grupos" style={{ marginRight: 10 }}>Grupos</Link>
        <Link to="/grupos/novo">+ Grupo</Link>
        <Link to="/ajustes"      style={{ marginRight: 10 }}>Ajustes</Link>
        <Link to="/ajustes/novo">+ Ajuste</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProductsList />} />
        <Route path="/novo" element={<ProductForm />} />
        <Route path="/grupos" element={<GroupsList />} />
        <Route path="/grupos/novo" element={<GroupForm />} />
        <Route path="/ajustes"        element={<AdjustmentsList />} />
        <Route path="/ajustes/novo"   element={<AdjustmentForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;