import express from "express";
import AssetController from '../controllers/asset.controller.js';

const router = express.Router();

router.get('/allAssets', AssetController.getAllAssets);
/*router.post('', );
router.put();
router.delete();*/

// TODO: write endpoints to use in flutter

export default router;