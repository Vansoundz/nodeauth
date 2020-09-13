const { Router } = require("express");
const authController = require("../controllers/authController");
const { body } = require("express-validator");
const router = Router();

router.get(`/signup`, authController.signup_get);
router.post(
  `/signup`,
  [
    body("email").isEmail().withMessage("Enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be 6 or more characters"),
  ],
  authController.signup_post
);
router.get(
  `/login`,
  [body("email").isEmail().withMessage("Enter a valid email")],
  authController.login_get
);
router.post(`/login`, authController.login_post);
router.get(`/logout`, authController.logout_get);

module.exports = router;
