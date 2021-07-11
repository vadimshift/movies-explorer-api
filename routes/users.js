const router = require('express').Router();
const {
  getUser,
  updateUser,
} = require('../controllers/users');
const { validateUpdateUserProfile } = require('../middlewares/validators');

router.get('/users/me', getUser);
router.patch('/users/me', validateUpdateUserProfile, updateUser);

module.exports = router;
