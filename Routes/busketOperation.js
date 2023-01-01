const busketCtrl = require('../controllers/busketOperationCtrl');
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/authCheck');
const isAdmin = require('../middleware/isAdmin');

// Get All ------------------------
router.get('/', busketCtrl.getAll);

// Get All Client Receipts ------------------------
router.get('/client/:id', busketCtrl.getClientAllReceipts)

// Get specific Receipts ------------------------
router.get('/:id', busketCtrl.getSpecific)

// Create New Object ------------------------
router.post('/', checkAuth, busketCtrl.addNew);

// Update Object ------------------------
router.put('/:id', checkAuth, busketCtrl.updateOne)

// Delete Object ------------------------
router.delete('/:id', checkAuth, isAdmin, busketCtrl.deleteOne)

module.exports = router;