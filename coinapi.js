import dotenv    from 'dotenv';
import fetch from 'node-fetch';

import Asset from './models/asset.model.js';
import Exchange from './models/exchange.model.js';

dotenv.config();
const options = {
    method: 'GET',
    headers: {'X-CoinAPI-Key': process.env.API_KEY}
}
const host = 'https://rest.coinapi.io/v1';

const checkEmptyDB = async () => {

    const assetsCounter = await Asset.countDocuments((err, count) => {
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

    const exchangesCounter = await Exchange.countDocuments((err, count) => {
        if(count > 0) {
            console.log("Found Records for Exchange: " + count);
        }
        else {
            console.log("No Found Records.");
        }
    }).clone().catch(err => console.log(err));

    return { assetsCounter, exchangesCounter };
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
        console.log(exchange.name);
        const newExchange = new Exchange(exchange);
        newExchange.save();
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

    let { assetsCounter, exchangesCounter } = await checkEmptyDB();
    
    if(assetsCounter > 0) { // il DB è popolato allora aggiorno i dati
        console.log('res ' + assetsCounter);
        console.log('Assets da aggiornare');
        updateAllAssets(); 
    } else { // devo popolare il DB
        console.log('res ' + res);
        console.log('Assets da popolare');
        getAllAssets();
    }
    
    if(exchangesCounter > 0) { // il DB è popolato allora aggiorno i dati
        console.log('res2 ' + exchangesCounter);
        console.log('Exchanges da aggiornare');
        updateAllExchanges(); 
    } else { // devo popolare il DB
        console.log('Exchanges da popolare');
        getAllExchanges();
    }

};