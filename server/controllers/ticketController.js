// controllers/ticketController.js
import Ticket from '../models/Ticket.js';

export const createTicket = async (req, res) => {
  const { title, description, status, priority, assignedTo, project } = req.body;

  if (!title || !project) {
    return res.status(400).json({ msg: 'Title and Project are required' });
  }

  try {
    const ticket = await Ticket.create({
      title,
      description,
      status,
      priority,
      assignedTo,
      project,
      createdBy: req.user.id
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
