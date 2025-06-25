const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  verifyCertificate,
  downloadCertificate
} = require('../controllers/certificateController');

router.post('/certificates', generateCertificate);
router.get('/certificates/:id', verifyCertificate);
router.get('/certificates/:id/download', downloadCertificate); 

module.exports = router;