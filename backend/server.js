// server.js

require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app = express();

// —————— BASIC AUTH CUSTOMIZADO ——————
const USER = process.env.BASIC_USER;
const PASS = process.env.BASIC_PASS;

app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Estoque"');
    return res.status(401).send('Autenticação necessária.');
  }
  const [u, p] = Buffer.from(auth.split(' ')[1], 'base64')
                     .toString('utf8')
                     .split(':');
  if (u === USER && p === PASS) return next();
  res.set('WWW-Authenticate', 'Basic realm="Estoque"');
  return res.status(401).send('Credenciais inválidas.');
});
// ————————————————————————————————

app.use(cors());
app.use(express.json());

// Conecta ao MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => {
    console.error('❌ Falha na conexão:', err.message);
    process.exit(1);
  });

// Schemas e Models
const grupoSchema = new mongoose.Schema({ nome: { type: String, required: true } });
const Grupo  = mongoose.model('Grupo', grupoSchema);

const produtoSchema = new mongoose.Schema({
  nome:       { type: String, required: true },
  sku:        String,
  quantidade: { type: Number, default: 0 },
  unidade:    String,
  grupo:      { type: mongoose.Schema.Types.ObjectId, ref: 'Grupo' },
});
const Produto = mongoose.model('Produto', produtoSchema);

const movimentoSchema = new mongoose.Schema({
  produto:    { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
  tipo:       { type: String, enum: ['entrada','saida'], required: true },
  quantidade: { type: Number, required: true },
  data:       { type: Date, default: Date.now },
  usuario:    String,
});
const Movimento = mongoose.model('Movimento', movimentoSchema);

// Rotas de API
app.get('/grupos', async (req, res) => {
  const grupos = await Grupo.find();
  res.json(grupos);
});
app.post('/grupos', async (req, res) => {
  const g = new Grupo(req.body);
  await g.save();
  res.status(201).json(g);
});

app.get('/produtos', async (req, res) => {
  const prods = await Produto.find().populate('grupo');
  res.json(prods);
});
app.post('/produtos', async (req, res) => {
  const { nome, sku, quantidade, unidade, grupo } = req.body;
  const data = { nome, sku, quantidade, unidade };
  if (grupo) data.grupo = grupo;
  const novo = new Produto(data);
  await novo.save();
  res.status(201).json(novo);
});

app.get('/movimentos', async (req, res) => {
  const movs = await Movimento.find().populate('produto');
  res.json(movs);
});
app.post('/movimentos', async (req, res) => {
  const m = new Movimento(req.body);
  const prod = await Produto.findById(m.produto);
  if (!prod) return res.status(404).json({ error: 'Produto não encontrado' });
  prod.quantidade += m.tipo === 'entrada' ? m.quantidade : -m.quantidade;
  await prod.save();
  await m.save();
  res.status(201).json(m);
});

// Serve o build React
const buildPath = path.join(__dirname, '../frontend/web-estoque/build');
app.use(express.static(buildPath));

// CATCH-ALL com RegExp para evitar path-to-regexp
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Inicia servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
