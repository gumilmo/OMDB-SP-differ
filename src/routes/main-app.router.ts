import { MainAppController } from "../controllers/main-app.controller";

const express = require('express');

const router = express.Router();

const mainAppController = new MainAppController();

router.post('/api/compare', mainAppController.compareDOM)
router.post('/api/compare-text', mainAppController.compareText)

module.exports = router;