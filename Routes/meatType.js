const meatTypeCtrl = require('../controllers/meatTypeCtrl')
const checkAuth = require('../middleware/authCheck')
const multerConfig = require('../middleware/multer')
const express = require('express');
const router = express.Router();

// Get All
router.get('/', meatTypeCtrl.getAll);

// Get details For Receipts
router.get('/receipt', meatTypeCtrl.getDetails);

// Get Specific Item
router.get('/:id', meatTypeCtrl.getSpecificItem);

// Get Specific Category
router.get('/:id', meatTypeCtrl.getSpecificCat)
  
// Create New Object
router.post('/', checkAuth, multerConfig, meatTypeCtrl.addNew);

// Update Object
router.put('/:id', checkAuth, multerConfig, meatTypeCtrl.updateOne)

// Delete Object
router.delete('/:id', checkAuth, meatTypeCtrl.deleteOne)

module.exports = router; 