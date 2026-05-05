const Usuario = require('../models/usuario');
const Pqrs = require('../models/pqrs');

const getEstadisticas = async (req, res) => {
  try {
    // Estadísticas de usuarios
    const totalUsuarios = await Usuario.countDocuments();
    const usuariosActivos = await Usuario.countDocuments({ activo: true });
    const inicioMes = new Date();
    inicioMes.setDate(1);
    const nuevosUsuariosMes = await Usuario.countDocuments({ createdAt: { $gte: inicioMes } });

    // Estadísticas de PQRS
    const totalPqrs = await Pqrs.countDocuments();
    const pqrsPendientes = await Pqrs.countDocuments({ estado: 'pendiente' });
    const pqrsResueltasMes = await Pqrs.countDocuments({ 
      estado: 'resuelto',
      updatedAt: { $gte: inicioMes }
    });

    // Distribución de usuarios
    const usuariosPorEstado = [
      usuariosActivos,
      totalUsuarios - usuariosActivos,
      nuevosUsuariosMes
    ];

    // PQRS por estado
    const pqrsPorEstado = [
      await Pqrs.countDocuments({ estado: 'pendiente' }),
      await Pqrs.countDocuments({ estado: 'en_proceso' }),
      await Pqrs.countDocuments({ estado: 'resuelto' }),
      await Pqrs.countDocuments({ estado: 'cerrado' })
    ];

    // PQRS por mes (últimos 6 meses) - usando PQRS como actividades
    const actividadesPorMes = [];
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date();
      fecha.setMonth(fecha.getMonth() - i);
      const inicioMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
      const finMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
      
      const count = await Pqrs.countDocuments({
        createdAt: { $gte: inicioMes, $lte: finMes }
      });
      actividadesPorMes.push(count);
    }

    res.json({
      usuarios: {
        total: totalUsuarios,
        activos: usuariosActivos,
        nuevosMes: nuevosUsuariosMes,
        distribucion: usuariosPorEstado
      },
      pqrs: {
        total: totalPqrs,
        pendientes: pqrsPendientes,
        resueltasMes: pqrsResueltasMes,
        porEstado: pqrsPorEstado
      },
      actividades: {
        total: totalPqrs,
        activos: pqrsPendientes,
        proximos: await Pqrs.countDocuments({ estado: 'en_proceso' }),
        porMes: actividadesPorMes
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEstadisticas
};
