const { Router } = require('express');
const { validateJWT } = require('../middlewares/jwt-validator');
const { check } = require('express-validator');
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/events');

const { fieldsValidator } = require('../middlewares/fields-validator');
const { isDate } = require('../helpers/date');

const router = Router();

//validateJWT in router
router.use(validateJWT);

//CRUD
router.get('/', getEvents);

router.post(
  '/',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('start', 'Start is required').not().isEmpty(),
    check('start', 'Start needs to be Date').custom(isDate),
    check('end', 'End is required').not().isEmpty(),
    check('end', 'End needs to be Date').custom(isDate),
    fieldsValidator,
  ],
  createEvent,
);

router.put(
  '/:id',
  [
    check('title', 'Title is required').not().isEmpty(),
    check('start', 'Start is required').not().isEmpty(),
    check('start', 'Start needs to be Date').custom(isDate),
    check('end', 'End is required').not().isEmpty(),
    check('end', 'End needs to be Date').custom(isDate),
    fieldsValidator,
  ],
  updateEvent,
);

router.delete('/:id', deleteEvent);

module.exports = router;
