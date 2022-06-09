import fetch     from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
export const getPercentageChange = async (asset_id, exchange_currency, current_price) => {
    // return something like 0,3 o -0,3
    var percentage_change = 0.0;
    // voglio calcolare il % rispetto a 24 ore fa
    // mi manca il prezzo di ieri
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency 
    + "?time=" + yesterday.toISOString() 
    + "&apiKey=" + process.env.API_KEY);

    const previous_exchangerate = await response.json();
    const previous_price = previous_exchangerate.rate;

    const diff = current_price - previous_price;
    
    percentage_change = (diff*100) / current_price;

    return Math.round((percentage_change + Number.EPSILON) * 100) / 100;
}

export const getStartPeriod = () => { 
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday; 
}

export const getEndPeriod = () => { return new Date(); }

export const getPlotRate = async (asset_id, exchange_currency, period_id) => {
    // return a list of plottable results
    let rates = [];

    /* const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency 
    + "/history?period_id=" + period_id + "&time_start=" + yesterday.toISOString()
    + "&time_end=" + today.toISOString() + "&apiKey=" + process.env.API_KEY); */

    const response = await fetch(`https://rest.coinapi.io/v1/exchangerate/${asset_id}/${exchange_currency}/history?period_id=${period_id}&time_start=${getStartPeriod().toISOString()}&time_end=${getEndPeriod().toISOString()}&apikey=BE6D370D-7FB6-45C5-81A3-AE07C8646C9E`);

    const exchangerateList = await response.json();

    rates = exchangerateList.map(item => { return item.rate_open; });

    return rates;
}