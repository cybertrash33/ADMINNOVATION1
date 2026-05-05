const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const URI = 'mongodb://localhost/adminnovation';

const adminUser = {
  nombre: 'Admin',
  tipoDocumento: 'cc',
  numeroDocumento: '0000000001',
  email: 'admin@adminnovation.com',
  telefono: '3000000000',
  tipoUsuario: 'Administrador/Empleado',
  tipoResidente: 'propietario',
  conjuntoResidencial: 'Reservas de San David 1',
  numeroBloque: '1',
  numeroApartamento: '001',
  password: 'Admin123456'
};

async function seedAdmin() {
  try {
    await mongoose.connect(URI);
    console.log('Conectado a MongoDB');

    const Usuario = mongoose.model('Usuario', new mongoose.Schema({
      nombre: { type: String, required: true, max: 100 },
      tipoDocumento: { type: String, required: true, max: 100 },
      numeroDocumento: { type: String, required: true, max: 100 },
      email: { type: String, required: true, max: 100 },
      telefono: { type: String, required: true, max: 100 },
      tipoUsuario: { type: String, required: true, max: 100 },
      tipoResidente: { type: String, required: true, max: 100 },
      conjuntoResidencial: { type: String, required: true, max: 100 },
      numeroBloque: { type: String, required: true, max: 100 },
      numeroApartamento: { type: String, required: true, max: 100 },
      password: { type: String, required: true, max: 100 },
      foto: { type: String, required: false }
    }, { timestamps: true }));

    const existing = await Usuario.findOne({ tipoUsuario: 'Administrador/Empleado' });
    if (existing) {
      console.log('Ya existe un usuario administrador:');
      console.log('  Email:', existing.email);
      console.log('  Nombre:', existing.nombre);
      console.log('  ID:', existing._id);
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = bcrypt.hashSync(adminUser.password, 10);
    const nuevoAdmin = new Usuario({ ...adminUser, password: hashedPassword });
    const saved = await nuevoAdmin.save();

    console.log('✅ Administrador creado exitosamente:');
    console.log('  Email:', adminUser.email);
    console.log('  Contraseña:', adminUser.password);
    console.log('  Tipo:', adminUser.tipoUsuario);
    console.log('  ID:', saved._id);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedAdmin();