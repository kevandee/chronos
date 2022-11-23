const {authenticateToken} = require('../utils/token');
const controller = require('../controllers/users');

const router = (require('express')).Router();

router.post('/location', authenticateToken, controller.setLocation);
router.get('/holiday', authenticateToken, controller.getHoliday);

module.exports = router;