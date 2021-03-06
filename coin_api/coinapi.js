/* importing dependecies */
import dotenv    from 'dotenv';
import fetch     from 'node-fetch';

/* importing mongoose models */
import AssetDTO        from './coin_api_models/asset.api_model.js';
import AssetIconDTO    from './coin_api_models/asset_icon.api_model.js';

/* setting up options for GET requests */
dotenv.config();
const options = {
    method: 'GET',
    headers: {
        'X-CoinAPI-Key': process.env.API_KEY,
        'Accept-Encoding': ['deflate', 'gzip']
    }
}
const host = 'https://rest.coinapi.io/v1';

/* function to check if each Collection in the DB is empty or not */
const checkEmptyDB = async () => {

    /* CHECKING ASSETS COLLECTION */
    const assetsCounter = await AssetDTO.countDocuments((err, count) => {
        if(count > 0) {
            console.log("Found Records for Assets: " + count);
        }
        else {
            console.log("No Found Records.");
        }
    }).clone().catch(err => console.log(err));
    /*Mongoose no longer allows executing the same query object twice. 
    If you do, you'll get a Query was already executed error. 
    Executing the same query instance twice is typically indicative of mixing 
    callbacks and promises, but if you need to execute the same query twice, 
    you can call Query#clone() to clone the query and re-execute it.
    */

    /* CHECKING ASSET ICONS COLLECTION */
    const assetIconsCounter = await AssetIconDTO.countDocuments((err, count) => {
        if(count > 0) {
            console.log("Found Records for Asset Icons: " + count);
        }
        else {
            console.log("No Found Records.");
        }
    }).clone().catch(err => console.log(err));

    return { assetsCounter, assetIconsCounter };
}

/**
 * API METHODS FOR FETCHING ICONS
 */
const getAllAssetIcons = async () => {
    const response = await fetch(host + '/assets/icons/64', options);
    const assetIconsList = await response.json();
    console.log('Sto facendo il fetch, attendere...');
    assetIconsList.forEach(assetIcon => {
        const newAssetIcon = new AssetIconDTO(assetIcon);
        newAssetIcon.save();
        console.log(newAssetIcon.exchange_id, 'salvato');
    });
}

const updateAllAssetIcons = async () => {
    const response = await fetch(host + '/assets/icons/64', options);
    const assetIconsList = await response.json();
    console.log('sto aggionrando le icone degli assets, attendere...');
    const bulkAssetIcons = assetIconsList.map(assetIcon => {
        return {
            updateOne: {
                filter: {
                    asset_id: assetIcon.asset_id
                },
                update: {
                    $set : {
                        asset_id: assetIcon.asset_id,
                        url: assetIcon.url,
                    }
                }
            }
        }
    })

    AssetIconDTO.bulkWrite(bulkAssetIcons).then((res) => {
        console.log("Documents Asset Icons Updated", res.modifiedCount)
    })
}

/**
 * API METHODS FOR FETCHING ASSETS
 */
const getAllAssets = async () => {
    const response = await fetch(host + '/assets', options);
    const assetsList = await response.json();
    console.log('Sto facendo il fetch, attendere...');
    assetsList.forEach(asset => {
        const newAsset = new AssetDTO(asset);
        newAsset.save();
        console.log(newAsset.name, 'salvato');
    });
}

const updateAllAssets = async () => {
    const response = await fetch(host + '/assets', options);
    const assetsList = await response.json();
    console.log('sto aggionrando gli assets, attendere...');
    const bulkAssets = assetsList.map(asset => {
        return {
            updateOne: {
                filter: {
                    asset_id: asset.asset_id
                },
                update: {
                    $set : {
                        asset_id: asset.asset_id,
                        name: asset.name,
                        type_is_crypto: asset.type_is_crypto,
                        data_start: asset.data_start,
                        data_end: asset.data_end,
                        data_quote_start: asset.data_quote_start,
                        data_quote_end: asset.data_quote_end,
                        data_orderbook_start: asset.data_orderbook_start,
                        data_orderbook_end: asset.data_orderbook_end,
                        data_trade_start: asset.data_trade_start,
                        data_trade_end: asset.data_trade_end,
                        data_symbols_count: asset.data_symbols_count,
                        volume_1hrs_usd: asset.volume_1hrs_usd,
                        volume_1day_usd: asset.volume_1day_usd,
                        volume_1mth_usd: asset.volume_1mth_usd,
                        price_usd: asset.price_usd,
                    }
                }
            }
        }
    })

    AssetDTO.bulkWrite(bulkAssets).then((res) => {
        console.log("Documents Assets Updated", res.modifiedCount)
    })
}

export default async function () {

    let { 
        assetsCounter, 
        assetIconsCounter
    } = await checkEmptyDB();
    
    if(assetsCounter > 0) {
        console.log('Assets da aggiornare');
        updateAllAssets(); 
    } else {
        console.log('Assets da popolare');
        getAllAssets();
    }
    
    if(assetIconsCounter > 0) {
        console.log('Asset Icons da aggiornare');
        updateAllAssetIcons(); 
    } else {
        console.log('Asset Icons da popolare');
        getAllAssetIcons();
    }

};