const {authenticateToken} = require('../utils/token');
const controller = require('../controllers/calendars');

const router = (require('express')).Router();

router.get('/', authenticateToken, controller.getCalendarsList);
router.post('/', authenticateToken, controller.newCalendar);
router.route('/:calendarId')
      .get(controller.getCalendar)
      .patch(authenticateToken, controller.updateCalendar)
      .delete(authenticateToken, controller.deleteCalendar);
router.route('/:calendarId/members')
      .get(controller.getCalendarMembers)
      .post(authenticateToken, controller.newCalendarMember);
router.route('/:calendarId/events')
      .get(authenticateToken, controller.getCalendarEvents)
      .post(authenticateToken, controller.newCalendarEvent)
      .delete(authenticateToken, controller.deleteCalendarEvent);

module.exports = router;