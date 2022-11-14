const {authenticateToken} = require('../utils/token');
const controller = require('../controllers/calendars');

const router = (require('express')).Router();

router.get('/', authenticateToken, controller.getCalendarsList);
router.post('/', authenticateToken, controller.newCalendar);
router.route('/:calendarId')
      .get(authenticateToken, controller.getCalendar)
      .patch(authenticateToken, controller.updateCalendar)
      .delete(authenticateToken, controller.deleteCalendar);
router.route('/:calendarId/members')
      .get(authenticateToken, controller.getCalendarMembers)
      .post(authenticateToken, controller.setCalendarMembers);
router.route('/:calendarId/events/:eventId')
      .get(authenticateToken, controller.getCalendarEvents)
      .post(authenticateToken, controller.newCalendarEvent)
      .delete(authenticateToken, controller.deleteCalendarEvent);

module.exports = router;