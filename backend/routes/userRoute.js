const { CreateAccount, LoginAccount, GetProfile, TestEmailing, ValidateOtp, ResendOtpVerification, FindAccountByEmail, VerifyOtpForPassword, ChangePasswordOnRequest } = require('../controllers/userController')
const { UserMiddleware } = require('../middleware/auth')


const router = require('express').Router()

router.post('/create-account', CreateAccount)
router.post('/login-account', LoginAccount)
router.get('/profile', UserMiddleware, GetProfile)
router.post('/validate-email', ValidateOtp)
router.post('/resend-otp', ResendOtpVerification)
router.post('/find-email', FindAccountByEmail)
router.post('/verify-email', VerifyOtpForPassword)
router.post('/change-password', ChangePasswordOnRequest)
router.get('/test-mail', TestEmailing)
module.exports = router