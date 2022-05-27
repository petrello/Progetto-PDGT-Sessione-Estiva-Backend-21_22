import express from "express";
import ExchangeController from '../controllers/exchange.controller.js';

const router = express.Router();

router.get('/allExchange', ExchangeController.getAllExchange);
/*router.post('', );
router.put();
router.delete();*/

// TODO: write endpoints to use in flutter

export default router;