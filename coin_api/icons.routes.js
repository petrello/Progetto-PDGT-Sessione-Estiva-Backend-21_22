import express from "express";
import IconsController from "../controllers/icons.controller";

const router = express.Router();

router.get('/allAssetIcons', IconsController.getAllAssetIcons);
router.get('/allExchangeIcons', IconsController.getAllExchangeIcons);
/*router.post('', );
router.put();
router.delete();*/

// TODO: write endpoints to use in flutter

export default router;