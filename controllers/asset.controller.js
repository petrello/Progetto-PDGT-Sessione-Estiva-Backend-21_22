import mongoose from 'mongoose';
import AssetModel from '../models/asset.model.js';
import Asset from '../models/coin_api_models/asset.model.js';
import AssetIcon from '../models/coin_api_models/asset_icon.model.js';

// GET - ritorna la lista di asset dell'utente (home page)
const getAllAssets = async (req, res) => {
    try {
        const allAssets = await AssetModel.find({});
        res.status(200).send({ status: "OK", data:  allAssets });
    } catch(err) {
        res.status(404).send({ status: "Not Found", message: err.message });
    }
}

// GET - ritorna un asset dettagliato specificato dall'utente
const getAssetById = async (req, res) => {
    const { asset_id: asset_id } = req.params;
    /* if(!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send({ status: "Not Found", message: "No asset with that id" });
    */
    try {
        // find a document by its id
        const asset = await AssetModel.findOne({ asset_id: asset_id });
        res.status(200).send( { status: "OK", data:  asset} );
    } catch(err) {
        res.status(404).send({ status: "Not Found", message: err.message });
    }
}

// TODO: GET - pensa ad altre get che possono essere utili all'utente

// POST - aggiungi un nuovo asset alla lista dell'utente
const addNewAsset = async (req, res) => {
    
    if (!req.body) 
        return res.status(400).send({ status: "Bad Request", message: "Body content is missing" });
    

    // cerco l'asset in tutta la collezione
    try {
        const receivedAsset = await Asset.findOne({ asset_id: req.body.asset_id });
        const assetIcon = await AssetIcon.findOne({ asset_id: receivedAsset.asset_id });
    } catch(err) {
        res.status(404).send({ status: "Not Found", message: err.message });
    }

    // se lo trovo allora posso usarlo per costruire
    // il nuovo asset

    const today = new Date();
    const yesterday = new(today - 1);

    // TODO: DEFINE % FUNCTION E [] FUNCTION

    const asset = {
        asset_id: receivedAsset.asset_id,
        name: receivedAsset.name,
        icon: assetIcon.url,
        percentage_change: 0.0,
        price: receivedAsset.price_usd,
        exchange_currency: "USD",
        time_period_start: yesterday,
        time_period_end: today,
        plot_rate: [0,0,0,0,0,0,0,0,0,0,0]
    }

    const newAsset = new AssetModel(asset);
    
    try {
        await newAsset.save();
        res.status(201).send({ status: "Created", data: newAsset });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }

}

// PUT - cambia exchange_currency della crypto corrente
const modifyExchangeCurrency = async (req, res) => {

}

// PUT - cambia periodo in cui plottiamo il grafico
const modifyTimePeriod = async (req, res) => {

}

// TODO: Pensa ad altre PUT ma per ora due vanno bene

// DELETE - elminia un asset specificato dall'utente
const deleteAssetById = async (req, res) => {
    
}

export default {
    getAllAssets,
    getAssetById,
    addNewAsset,
    modifyExchangeCurrency,
    modifyTimePeriod,
    deleteAssetById,
}