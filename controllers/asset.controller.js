import mongoose from 'mongoose';
import { getEndPeriod, getPercentageChange, getPlotRate, getStartPeriod } from '../helpers.js';
import AssetModel from '../models/asset.model.js';
import Asset from '../models/coin_api_models/asset.model.js';
import AssetIcon from '../models/coin_api_models/asset_icon.model.js';

// GET - ritorna la lista di asset dell'utente (home page)
const getAllAssets = async (req, res) => {
    try {
        const allAssets = await AssetModel.find({});
        console.log(allAssets);
        if(!allAssets)
            res.status(200).send({ status: "OK", data:  allAssets });
        else
            res.status(204).send({ status: "No Content", message: "No assets yet" });
    } catch(err) {
        res.status(400).send({ status: "Bad Request", message: err.message });
    }
}

// GET - ritorna un asset dettagliato specificato dall'utente
const getAssetById = async (req, res) => {
    const { asset_id: asset_id } = req.params;

    try {
        // find a document by its id
        const asset = await AssetModel.findOne({ asset_id: asset_id });
        if(asset)
            res.status(200).send( { status: "OK", data:  asset} );
        else
            res.status(404).send({ status: "Not Found", message: `Asset ${asset_id} not found` });

    } catch(err) {
        res.status(400).send({ status: "Bad Request", message: err.message });
    }
}

// TODO: GET - pensa ad altre get che possono essere utili all'utente

// POST - aggiungi un nuovo asset alla lista dell'utente
const addNewAsset = async (req, res) => {
    
    if (!req.body.asset_id)
        return res.status(400).send({ status: "Bad Request", message: "Body content is missing" });

    // cerco l'asset in tutta la collezione
    let receivedAsset, assetIcon;
    try {
        receivedAsset = await Asset.findOne({ asset_id: req.body.asset_id });
        assetIcon = await AssetIcon.findOne({ asset_id: req.body.asset_id });
        if(!receivedAsset || !assetIcon)
            return res.status(404).send({ status: "Not Found", message: `Asset ${req.body.asset_id} not found` });
    } catch(err) {
        return res.status(500).send({ status: "Internal Server Error", message: err.message });
    }

    // se lo trovo allora posso usarlo per costruire
    // il nuovo asset

    const asset = {
        // a new asset will be inizialized with default attribute
        // than the user will be able to modify them using PUT requests
        asset_id: receivedAsset.asset_id,
        name: receivedAsset.name,
        icon: assetIcon.url,
        percentage_change: await getPercentageChange(receivedAsset.asset_id, "USD", receivedAsset.price_usd),
        price: receivedAsset.price_usd,
        exchange_currency: "USD",
        time_period_start: getStartPeriod(),
        time_period_end: getEndPeriod(),
        plot_rate: await getPlotRate(receivedAsset.asset_id, "USD", "1HRS"),
    }

    const assetExists = await AssetModel.exists({ asset_id: receivedAsset.asset_id });
    // verifico se l'assets si trova già nella lista
    if(assetExists)
        return res.status(403).json({ 
            status: "Forbidden", 
            message: `Asset ${receivedAsset.asset_id} already exists` 
        });

    const newAsset = new AssetModel(asset);
    
    try {
        await newAsset.save();
        res.status(201).send({ status: "Created", data: newAsset });
    } catch (error) {
        res.status(409).json({ status: "Conflict", message: error.message });
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