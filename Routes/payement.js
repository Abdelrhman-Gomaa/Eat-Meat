const paymentCtrl = require('../controllers/paymentCtrl')
const express = require('express')
const router = express();

router.get('/pay', paymentCtrl.getPage)

router.post('/payment', paymentCtrl.pay)

module.exports = router