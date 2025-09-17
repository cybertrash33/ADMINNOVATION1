const express = require('express');
const router = express.Router();
const Residente = require('../models/residente');

// GET todos los residentes
router.get('/', async (req, res) => {
  try {
    const residentes = await Residente.find();
    res.json(residentes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET un residente específico por ID
router.get('/:id', async (req, res) => {
  try {
    const residente = await Residente.findById(req.params.id);
    if (!residente) {
      return res.status(404).json({ message: 'Residente no encontrado' });
    }
    res.json(residente);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar residente' });
  }
});

// CREATE un nuevo residente
router.post('/', async (req, res) => {
  try {
    const residente = new Residente({
        nombre: req.body.nombre,
        tipo_de_usuario: req.body.tipo_de_usuario,
        correo: req.body.correo,
        tipo_de_documento: req.body.tipo_de_documento,
        numero_de_documentacion: req.body.numero_de_documentacion || '',
        teléfono: req.body.teléfono || '',
        tipo_de_residente: req.body.tipo_de_residente || '',
        contraseña: req.body.contraseña || '',
        id_de_usuario: req.body.id_de_usuario || '',
        fecha_registro: req.body.fecha_registro || '',
    });

    const nuevoResidente = await residente.save();
    res.status(201).json(nuevoResidente);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE un residente
router.put('/:id', async (req, res) => {
  try {
    const residente = await Residente.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        tipo_de_usuario: req.body.tipo_de_usuario,
        correo: req.body.correo,
        tipo_de_documento: req.body.tipo_de_documento,
        numero_de_documentacion: req.body.numero_de_documentacion || '',
        teléfono: req.body.teléfono || '',
        tipo_de_residente: req.body.tipo_de_residente || '',
        contraseña: req.body.contraseña || '',
        id_de_usuario: req.body.id_de_usuario || '',
        fecha_registro: req.body.fecha_registro || '',
  
      },
      { new: true, runValidators: true }
    );

    if (!residente) {
      return res.status(404).json({ message: 'Residente no encontrado' });
    }

    res.json(residente);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE un residente
router.delete('/:id', async (req, res) => {
  try {
    const residente = await Residente.findByIdAndDelete(req.params.id);
    
    if (!residente) {
      return res.status(404).json({ message: 'Residente no encontrado' });
    }

    res.json({ message: 'Residente eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;