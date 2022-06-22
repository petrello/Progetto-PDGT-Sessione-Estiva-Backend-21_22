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

    /* CHECKING EXCHANGES COLLECTION */
    const exchangesCounter = await Exchange.countDocuments((err, count) => {
        if(count > 0) {
            console.log("Found Records for Exchange: " + count);
        }
        else {
            console.log("No Found Records.");
        }
    }).clone().catch(err => console.log(err));

    /* CHECKING ASSET ICONS COLLECTION */
    const assetIconsCounter = await AssetIcon.countDocuments((err, count) => {
        if(count > 0) {
            console.log("Found Records for Asset Icons: " + count);
        }
        else {
            console.log("No Found Records.");
        }
    }).clone().catch(err => console.log(err));

    /* CHECKING EXCHANGE ICONS COLLECTION */
    const exchangeIconsCounter = await ExchangeIcon.countDocuments((err, count) => {
        if(count > 0) {
            console.log("Found Records for Exchange Icons: " + count);
        }
        else {
            console.log("No Found Records.");
        }
    }).clone().catch(err => console.log(err));

    return { assetsCounter, exchangesCounter, assetIconsCounter, exchangeIconsCounter };
}

/**
 * API METHODS FOR FETCHING ICONS
 */
const getAllAssetIcons = async () => {
    const response = await fetch(host + '/assets/icons/64', options);
    const assetIconsList = await response.json();
    console.log('Sto facendo il fetch, attendere...');
    assetIconsList.forEach(assetIcon => {
        const newAssetIcon = new AssetIcon(assetIcon);
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

    AssetIcon.bulkWrite(bulkAssetIcons).then((res) => {
        console.log("Documents Asset Icons Updated", res.modifiedCount)
    })
}

/**
 * API METHODS FOR FETCHING ICONS
 */
const getAllExchangeIcons = async () => {
    const response = await fetch(host + '/exchanges/icons/64', options);
    const exchangeIconsList = await response.json();
    console.log('Sto facendo il fetch, attendere...');
    exchangeIconsList.forEach(exchangeIcon => {
        const newExchangeIcon = new ExchangeIcon(exchangeIcon);
        newExchangeIcon.save();
        console.log(newExchangeIcon.exchange_id, 'salvato');
        
    });
}
const updateAllExchangeIcons = async () => {
    const response = await fetch(host + '/assets/icons/64', options);
    const exchangeIconsList = await response.json();
    console.log('sto aggionrando le icone degli exchange, attendere...');
    const bulkExchangeIcons = exchangeIconsList.map(exchangeIcon => {
        return {
            updateOne: {
                filter: {
                    exchange_id: exchangeIcon.exchange_id
                },
                update: {
                    $set : {
                        exchange_id: exchangeIcon.exchange_id,
                        url: exchangeIcon.url,
                    }
                }
            }
        }
    })

    ExchangeIcon.bulkWrite(bulkExchangeIcons).then((res) => {
        console.log("Documents Exchange Icons Updated", res.modifiedCount)
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
        const newAsset = new Asset(asset);
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

    Asset.bulkWrite(bulkAssets).then((res) => {
        console.log("Documents Assets Updated", res.modifiedCount)
    })
}

/**
 * API METHODS FOR FETCHING EXCHANGES
 */
const getAllExchanges = async () => {

    const response = await fetch(host + '/exchanges', options);
    const exchangesList = await response.json();
    console.log('Sto facendo il fetch degli Exchanges, attendere...');
    exchangesList.forEach(exchange => {
        //console.log(exchange.name);
        const newExchange = new Exchange(exchange);
        newExchange.save();
        console.log(newExchange.name, 'salvato');
    });
}

const updateAllExchanges = async () => {
    const response = await fetch(host + '/exchanges', options);
    const exchangesList = await response.json();
    console.log('sto aggionrando gli Exchanges, attendere...');
    const bulkExchanges = exchangesList.map(exchange => {
        return {
            updateOne: {
                filter: {
                    exchange_id: exchange.exchange_id
                },
                update: {
                    $set : {
                        exchange_id: exchange.exchange_id,
                        website: exchange.website,
                        name: exchange.name,
                        data_start: exchange.data_start,
                        data_end: exchange.data_end,
                        data_quote_start: exchange.data_quote_start,
                        data_quote_end: exchange.data_quote_end,
                        data_orderbook_start: exchange.data_orderbook_start,
                        data_orderbook_end: exchange.data_orderbook_end,
                        data_trade_start: exchange.data_trade_start,
                        data_trade_end: exchange.data_trade_end,
                        data_symbols_count: exchange.data_symbols_count,
                        volume_1hrs_usd: exchange.volume_1hrs_usd,
                        volume_1day_usd: exchange.volume_1day_usd,
                        volume_1mth_usd: exchange.volume_1mth_usd
                    }
                }
            }
        }
    })
    Exchange.bulkWrite(bulkExchanges).then((res) => {
        console.log("Documents Exchange Updated", res.modifiedCount)
    })
}

export default async function () {

    let { 
        assetsCounter, 
        exchangesCounter, 
        assetIconsCounter, 
        exchangeIconsCounter 
    } = await checkEmptyDB();
    
    /* if(assetsCounter > 0) {
        console.log('Assets da aggiornare');
        updateAllAssets(); 
    } else {
        console.log('Assets da popolare');
        getAllAssets();
    }
    
    if(exchangesCounter > 0) {
        console.log('Exchanges da aggiornare');
        updateAllExchanges(); 
    } else {
        console.log('Exchanges da popolare');
        getAllExchanges();
    } */

    /* if(exchangeIconsCounter > 0) {
        console.log('Exchange Icons da aggiornare');
        updateAllExchangeIcons(); 
    } else {
        console.log('Exchange Icons da popolare');
        getAllExchangeIcons();
    }
    if(assetIconsCounter > 0) {
        console.log('Asset Icons da aggiornare');
        updateAllAssetIcons(); 
    } else {
        console.log('Asset Icons da popolare');
        getAllAssetIcons();
    } */

};