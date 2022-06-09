import fetch  from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export const getCurrentPrice = async (asset_id, exchange_currency, time_period_end) => {
    const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency
    + "?time=" + time_period_end
    + "&apiKey=" + process.env.API_KEY);
    const current_exchangerate = await response.json();
    const current_price = current_exchangerate.rate;
    return current_price;
}

export const get1HAgoPrice = async (asset_id, exchange_currency) => {
    var lastHour = new Date();
    lastHour.setHours(lastHour.getHours() - 1);

    const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency 
    + "?time=" + lastHour 
    + "&apiKey=" + process.env.API_KEY);
    const previous_exchangerate = await response.json();
    const previous_price = previous_exchangerate.rate;
    return previous_price;
}

export const get1DAgoPrice = async (asset_id, exchange_currency) => {
    var lastDay = new Date();
    lastDay.setDate(lastDay.getDate() - 1);

    const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency 
    + "?time=" + lastDay 
    + "&apiKey=" + process.env.API_KEY);
    const previous_exchangerate = await response.json();
    const previous_price = previous_exchangerate.rate;
    return previous_price;
}

export const get1WAgoPrice = async (asset_id, exchange_currency) => {
    var lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency
    + "?time=" + lastWeek
    + "&apiKey=" + process.env.API_KEY);
    const current_exchangerate = await response.json();
    const current_price = current_exchangerate.rate;
    return current_price;
}

export const get1MAgoPrice = async (asset_id, exchange_currency) => {
    var lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);

    const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency
    + "?time=" + lastMonth
    + "&apiKey=" + process.env.API_KEY);
    const current_exchangerate = await response.json();
    const current_price = current_exchangerate.rate;
    return current_price;
}

export const get1YAgoPrice = async (asset_id, exchange_currency) => {
    var lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency
    + "?time=" + lastYear
    + "&apiKey=" + process.env.API_KEY);
    const current_exchangerate = await response.json();
    const current_price = current_exchangerate.rate;
    return current_price;
}

// TRY REFACTORING THESE METHODS WITH A SWITCH
export const getPercentageChange = async (asset_id, exchange_currency, duration_id, current_time) => {
    // return something like 0,3 o -0,3
    var percentage_change = 0.0;

    const current_price = await getCurrentPrice(asset_id, exchange_currency, current_time);
    
    let previous_price;
    console.log(duration_id);
    switch(duration_id) {
        case "1HRS": 
            previous_price = await get1HAgoPrice(asset_id, exchange_currency);
            break;
        case "1DAY":
            previous_price = await get1DAgoPrice(asset_id, exchange_currency);
            break;
        case "1WEK":
            previous_price = await get1WAgoPrice(asset_id, exchange_currency);
            break;
        case "1MTH":
            previous_price = await get1MAgoPrice(asset_id, exchange_currency);
            break;
        case "1YER":
            previous_price = await get1YAgoPrice(asset_id, exchange_currency);
            break;
    }

    const diff = current_price - previous_price;

    console.log("C - " + current_price);
    console.log("P - " + previous_price);
    
    percentage_change = (diff*100) / current_price;

    return Math.round((percentage_change + Number.EPSILON) * 100) / 100;
}

export const getDefaultStartPeriod = () => { 
    var startPeriod = new Date();
    startPeriod.setDate(startPeriod.getDate() - 1);
    return startPeriod;
}

export const getDefaultEndPeriod = () => { return new Date(); }

export const getPlotRate = async (asset_id, exchange_currency, period_id, time_period_start, time_period_end) => {
    // return a list of plottable results
    let rates = [];

    const response = await fetch(`https://rest.coinapi.io/v1/exchangerate/${asset_id}/${exchange_currency}/history?period_id=${period_id}&time_start=${time_period_start}&time_end=${time_period_end}&apikey=BE6D370D-7FB6-45C5-81A3-AE07C8646C9E`);

    const exchangerateList = await response.json();

    rates = exchangerateList.map(item => { return item.rate_open; });

    return rates;
}