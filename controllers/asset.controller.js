import { 
    getCurrentPrice, 
    getDefaultEndPeriod,  
    getDefaultStartPeriod,
    getStartPeriod,
    getPeriod,
    getPercentageChange, 
    getPlotRate,
} from '../utils/helpers.js';
import AssetModel from '../models/asset.model.js';
import AssetDTO from '../coin_api/coin_api_models/asset.api_model.js';
import AssetIconDTO from '../coin_api/coin_api_models/asset_icon.api_model.js';

// GET - ritorna la lista di asset dell'utente (home page)
const getAllAssets = async (req, res) => {
    try {
        const allAssets = await AssetModel.find({});
        if(typeof allAssets !== 'undefined' && allAssets.length > 0)
            res.status(200).send({ status: "OK", data: allAssets });
        else
            res.status(204).send(); // no content -> it has no body
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
        res.status(500).send({ status: "Internal Server Error", message: err.message });
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
        receivedAsset = await AssetDTO.findOne({ asset_id: req.body.asset_id });
        assetIcon = await AssetIconDTO.findOne({ asset_id: req.body.asset_id });
        if(!receivedAsset || !assetIcon)
            return res.status(404).send({ status: "Not Found", message: `Asset ${req.body.asset_id} not found` });
    } catch(err) {
        return res.status(500).send({ status: "Internal Server Error", message: err.message });
    }

    // se lo trovo allora posso usarlo per costruire
    // il nuovo asset

    const defaultStartPeriod = getDefaultStartPeriod();
    const defaultEndPeriod = getDefaultEndPeriod();

    console.log("CREATE ASSET - def start period: " + defaultStartPeriod);
    console.log("CREATE ASSET - def end period: " + defaultEndPeriod);

    const asset = {
        // a new asset will be inizialized with default attribute
        // than the user will be able to modify them using PUT requests
        asset_id: receivedAsset.asset_id,
        name: receivedAsset.name,
        icon: assetIcon.url,
        percentage_change: await getPercentageChange(receivedAsset.asset_id, "USD", "1DAY", defaultEndPeriod),
        price: await getCurrentPrice(receivedAsset.asset_id, "USD", defaultEndPeriod),
        exchange_currency: "USD",
        period_id: "1HRS",
        duration_id: "1DAY", 
        time_period_start: defaultStartPeriod,
        time_period_end: defaultEndPeriod,
        plot_rate: await getPlotRate(receivedAsset.asset_id, "USD", "1HRS", defaultStartPeriod, defaultEndPeriod)
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
    const { asset_id: asset_id } = req.params;
    
    if (!req.body)
        return res.status(400).send({ status: "Bad Request", message: "Body content is missing" });

    /* const asset = req.body;
    
    // i have to reconvert ISO strings into Date objects
    asset.time_period_start = new Date(asset.time_period_start);
    asset.time_period_end = new Date(asset.time_period_end); */

    /* OPTION 2 */
    const { exchange_currency, duration_id,
            time_period_end, period_id, time_period_start } = req.body;

    let changedAsset;
    try {
        changedAsset = await AssetModel.findOneAndUpdate(
            { asset_id: asset_id },
            { 
                /* percentage_change: await getPercentageChange(asset_id, asset.exchange_currency, asset.duration_id, asset.time_period_end),
                time_period_end: asset.time_period_end,
                price: await getCurrentPrice(asset_id, asset.exchange_currency, asset.time_period_end),
                exchange_currency: asset.exchange_currency,
                plot_rate: await getPlotRate(asset_id, asset.exchange_currency, asset.period_id, asset.time_period_start, asset.time_period_end) */
                percentage_change: await getPercentageChange(asset_id, exchange_currency, duration_id, new Date(time_period_end)),
                price: await getCurrentPrice(asset_id, exchange_currency, new Date(time_period_end)),
                exchange_currency: exchange_currency,
                plot_rate: await getPlotRate(asset_id, exchange_currency, period_id, new Date(time_period_start), new Date(time_period_end))

            },
            { new: true }
        );
        if(!changedAsset)
            res.status(404).send({ status: "Not Found", message: `Asset ${asset_id} not found` });
        else
            res.status(200).send({ status: "OK", data: changedAsset });
    } catch(err) {
        res.status(500).send({ status: "Internal Server Error", message: err.message });
    }
}

// PUT - cambia periodo in cui plottiamo il grafico
const modifyTimePeriod = async (req, res) => {
    const { asset_id: asset_id } = req.params;
    
    if (!req.body.asset_id)
        return res.status(400).send({ status: "Bad Request", message: "Body content is missing" });

    // const asset = req.body;

    const { duration_id, exchange_currency } = req.body;
    
    // voglio aggiornare (ricalcolo) le seguenti informazioni
    time_period_end = getDefaultEndPeriod();
    time_period_start = getStartPeriod(duration_id, time_period_end);
    period_id = getPeriod(duration_id);


    let changedAsset;
    try {
        changedAsset = await AssetModel.findOneAndUpdate(
            { asset_id: asset_id },
            { 
                percentage_change: await getPercentageChange(asset_id, exchange_currency, time_period_end),
                price: await getCurrentPrice(asset_id, exchange_currency, time_period_end),
                period_id: period_id,
                duration_id: duration_id,
                time_period_start: time_period_start,
                time_period_end: time_period_end,
                plot_rate: await getPlotRate(asset_id, exchange_currency, period_id, time_period_start, time_period_end)
            },
            { new: true }
        );
    } catch(err) {
        return res.status(500).send({ status: "Internal Server Error", message: err.message });
    }

    if(!changedAsset)
        res.status(404).send({ status: "Not Found", message: `Asset ${asset_id} not found` });
    else
        res.status(200).send({ status: "OK", data: changedAsset });
}

// TODO: Pensa ad altre PUT ma per ora due vanno bene

// DELETE - elminia un asset specificato dall'utente
const deleteAssetById = async (req, res) => {
    const { asset_id: asset_id } = req.params;

    /* if(!mongoose.Types.ObjectId.isValid(_id)) 
        return res.status(404).send({ status: "Not Found", message: "No asset found with that id" }); */

    try {
        const deletedAsset = await AssetModel.findOneAndRemove({ asset_id: asset_id });
        if(deletedAsset)
            res.status(200).send({ status:"OK", data: deletedAsset });
        else
            res.status(404).send({ status: "Not Found", message: `Asset ${asset_id} not found` });
    } catch(err) {
        res.status(500).send({ status: "Internal Server Error", message: err.message });
    }
}

export default {
    getAllAssets,
    getAssetById,
    addNewAsset,
    modifyExchangeCurrency,
    modifyTimePeriod,
    deleteAssetById,
}