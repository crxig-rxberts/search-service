const express = require('express');
const { submitData, searchData, deleteData } = require('../controllers/searchController');
const { validateSubmitData, validateSearchQuery, validateDeleteData } = require('../schemas/searchSchemas');
const authFilter = require('../middleware/authFilter');

const router = express.Router();

router.post('/submit-provider', validateSubmitData, submitData);
router.get('/search-providers', authFilter, validateSearchQuery, searchData);
router.delete('/delete-provider/:id', authFilter, validateDeleteData, deleteData);

module.exports = router;
