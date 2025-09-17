require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const residentesRoutes = require('./routes/residentes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/residentes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error de MongoDB:', err));

// Rutas
app.use('/api/residentes', residentesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Residentes funcionando' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
});