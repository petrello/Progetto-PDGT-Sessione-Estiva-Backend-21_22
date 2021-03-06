import express from "express";
import AssetController from '../controllers/asset.controller.js';

const router = express.Router();

// GET ROUTES
router.get('/',             AssetController.getAllAssets);
router.get('/:asset_id',    AssetController.getAssetById);

// POST ROUTES
router.post('/',            AssetController.addNewAsset);

// PUT ROUTES
router.put('/exchangerate/:asset_id',    AssetController.modifyExchangeCurrency);
router.put('/history/:asset_id',    AssetController.modifyTimePeriod);

// DELETE ROUTES
router.delete('/:asset_id', AssetController.deleteAssetById);

export default router;