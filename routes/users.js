const router = require('express').Router();
const {
  getUser,
  updateUser,
  logout,
} = require('../controllers/users');
const { validateUpdateUserProfile } = require('../middlewares/validators');

router.get('/users/me', getUser);
router.patch('/users/me', validateUpdateUserProfile, updateUser);
router.get('/signout', logout);

module.exports = router;
