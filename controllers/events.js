const { response } = require('express');
const Event = require('../models/Event');
const { errorRes500 } = require('../helpers/response-messages');

const createEvent = async (req, res = response) => {
  const event = new Event(req.body);
  console.log(event);

  try {
    event.user = req.uid;
    const savedEvent = await event.save();
    return res.status(201).json({
      ok: true,
      event: savedEvent,
    });
  } catch (error) {
    errorRes500(error, res);
  }
};

const getEvents = async (req, res = response) => {
  try {
    const events = await Event.find().populate('user', 'name'); //study and play more about populate
    return res.status(200).json({
      ok: true,
      events,
    });
  } catch (error) {
    errorRes500(error, res);
  }
};

const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: `Event doesn't exist with this id`,
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: `You don't have the privilege to edit this event`,
      });
    }

    const newEvent = {
      ...req.body,
      user: uid,
    };

    const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });
    return res.status(200).json({
      ok: true,
      updatedEvent,
    });
  } catch (error) {
    errorRes500(error, res);
  }
};

const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: `Event doesn't exist with this id`,
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: `You don't have the privilege to delete this event`,
      });
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    return res.status(200).json({
      ok: true,
      deletedEvent,
    });
  } catch (error) {
    errorRes500(error, res);
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
