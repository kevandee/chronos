const controller = require('../controllers/users');

const router = (require('express')).Router();

router.post('/location', controller.setLocation);

module.exports = router;