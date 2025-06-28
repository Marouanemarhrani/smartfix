const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

const router = express.Router();

// Routes protégées par authentification
router.post('/', auth, appointmentController.createAppointment);
router.get('/problem/:problemId', auth, appointmentController.getProblemAppointments);
router.get('/my-appointments', auth, appointmentController.getMyAppointments);
router.patch('/:id/status', auth, appointmentController.updateAppointmentStatus);

module.exports = router; 