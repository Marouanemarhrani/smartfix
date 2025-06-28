const Appointment = require('../models/Appointment');
const Problem = require('../models/Problem');

exports.createAppointment = async (req, res) => {
  try {
    const { problemId, date, time } = req.body;
    const userId = req.user.userId;
    const userRole = req.user.role;

    // Vérifier si le problème existe
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problème non trouvé' });
    }

    // Vérifier si l'utilisateur a le droit de créer un rendez-vous
    if (userRole === 'client' && problem.client_id !== userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    if (userRole === 'artisan' && problem.artisan_id !== userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const appointmentId = await Appointment.create({
      problemId,
      artisanId: problem.artisan_id,
      clientId: problem.client_id,
      date,
      time,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Rendez-vous créé avec succès',
      appointmentId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProblemAppointments = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const userId = req.user.userId;

    // Vérifier si l'utilisateur a le droit de voir les rendez-vous
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problème non trouvé' });
    }

    if (problem.client_id !== userId && problem.artisan_id !== userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const appointments = await Appointment.findByProblemId(problemId);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const appointments = await Appointment.findByUserId(userId);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointmentId = req.params.id;
    const userId = req.user.userId;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Vérifier si l'utilisateur a le droit de modifier le statut
    if (appointment.client_id !== userId && appointment.artisan_id !== userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await Appointment.updateStatus(appointmentId, status);
    res.json({ message: 'Statut mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 