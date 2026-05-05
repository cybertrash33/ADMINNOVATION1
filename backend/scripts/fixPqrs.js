const mongoose = require('mongoose');

async function fix() {
  await mongoose.connect('mongodb://localhost/adminnovation');
  const db = mongoose.connection.db;

  await db.collection('pqrs').updateOne(
    { numeroRadicado: 'PENDIENTE' },
    { $set: { numeroRadicado: 'PQ-0004' } }
  );

  await db.collection('pqrs').updateOne(
    { numeroRadicado: 'PQ0001' },
    { $set: { numeroRadicado: 'PQ-0001' } }
  );

  await db.collection('pqrs').updateOne(
    { numeroRadicado: 'PQ0002' },
    { $set: { numeroRadicado: 'PQ-0002' } }
  );

  const docs = await db.collection('pqrs').find({}).sort({ numeroRadicado: 1 }).toArray();
  docs.forEach(d => console.log(d.numeroRadicado, '|', d.tipo, '|', d.asunto));

  await mongoose.disconnect();
}

fix().catch(e => { console.error(e); mongoose.disconnect(); });