const express = require('express');
const CategoryCtr = require('../controllers/CategoryCtrl');
const checkAuth = require('../middleware/authCheck')
const isAdmin = require('../middleware/isAdmin');
const multerConfig = require('../middleware/multer')
const router = express.Router();

// Get All
router.get('/', CategoryCtr.getAll);

// Get Specific Category
router.get('/', CategoryCtr.getSpecific);
  
// Create New Object
router.post('/', checkAuth, multerConfig, CategoryCtr.addCategory);

// Update Object
router.put('/:id', checkAuth, isAdmin, multerConfig, CategoryCtr.updateCategory)

// Delete Object
router.delete('/:id', isAdmin, checkAuth, CategoryCtr.deleteOne)

module.exports = router; 