import fetch  from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const getExchangeRateByAsset = async (asset_id, exchange_currency, date) =>  {
    const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency 
    + "?time=" + date.toISOString()
    + "&apiKey=" + process.env.API_KEY);
    const exchangerate = await response.json();
    const price = exchangerate.rate;
    return price;
}

export const getCurrentPrice = async (asset_id, exchange_currency, time_period_end) => {
    console.log("getCurrentPrice - time period end: " + time_period_end);
    console.log("getCurrentPrice - time period end ISO: " + time_period_end.toISOString());
    /* const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency
    + "?time=" + time_period_end.toISOString()
    + "&apiKey=" + process.env.API_KEY);
    const current_exchangerate = await response.json();
    const current_price = current_exchangerate.rate;
    return current_price; */
    return await getExchangeRateByAsset(asset_id, exchange_currency, time_period_end);
}

export const get1HAgoPrice = async (asset_id, exchange_currency) => {
    var lastHour = new Date();
    lastHour.setHours(lastHour.getHours() - 1);

    return await getExchangeRateByAsset(asset_id, exchange_currency, lastHour);

    /* const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency 
    + "?time=" + lastHour.toISOString()
    + "&apiKey=" + process.env.API_KEY);
    const previous_exchangerate = await response.json();
    const previous_price = previous_exchangerate.rate;
    return previous_price; */
}

export const get1DAgoPrice = async (asset_id, exchange_currency) => {
    var lastDay = new Date();
    lastDay.setDate(lastDay.getDate() - 1);
    /* //PATCH for coin api not working these days
    var lastDay = new Date();
    lastDay.setDate(lastDay.getDate() - 11); */

    return await getExchangeRateByAsset(asset_id, exchange_currency, lastDay);

    /* const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency 
    + "?time=" + lastDay.toISOString()
    + "&apiKey=" + process.env.API_KEY);
    const previous_exchangerate = await response.json();
    const previous_price = previous_exchangerate.rate;
    return previous_price; */
}

export const get1WAgoPrice = async (asset_id, exchange_currency) => {
    var lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    return await getExchangeRateByAsset(asset_id, exchange_currency, lastWeek);

    /* const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency
    + "?time=" + lastWeek.toISOString()
    + "&apiKey=" + process.env.API_KEY);
    const current_exchangerate = await response.json();
    const current_price = current_exchangerate.rate;
    return current_price; */
}

export const get1MAgoPrice = async (asset_id, exchange_currency) => {
    var lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);

    return await getExchangeRateByAsset(asset_id, exchange_currency, lastMonth);

    /* const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency
    + "?time=" + lastMonth.toISOString()
    + "&apiKey=" + process.env.API_KEY);
    const current_exchangerate = await response.json();
    const current_price = current_exchangerate.rate;
    return current_price; */
}

export const get1YAgoPrice = async (asset_id, exchange_currency) => {
    var lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    return await getExchangeRateByAsset(asset_id, exchange_currency, lastYear);

    /* const response = await fetch("https://rest.coinapi.io/v1/exchangerate/" 
    + asset_id + "/" + exchange_currency
    + "?time=" + lastYear.toISOString()
    + "&apiKey=" + process.env.API_KEY);
    const current_exchangerate = await response.json();
    const current_price = current_exchangerate.rate;
    return current_price; */
}

// TRY REFACTORING THESE METHODS WITH A SWITCH
export const getPercentageChange = async (asset_id, exchange_currency, duration_id, current_time) => {
    // return something like 0,3 o -0,3
    var percentage_change = 0.0;
    console.log("getPercentageChange - Current TIME: " + current_time);

    const current_price = await getCurrentPrice(asset_id, exchange_currency, current_time);

    console.log("getPercentageChange - Current price: " + current_price);
    console.log("getPercentageChange - Current price: " + current_time);
    const previous_date = getStartPeriod(duration_id, current_time);
    console.log("getPercentageChange - DATA previusooo"+previous_date);
    const previous_price = await getExchangeRateByAsset(asset_id, exchange_currency, previous_date);
    
    /* let previous_price;
    switch(duration_id) {
        case "1HRS":
            
    console.log(duration_id);
            previous_price = await get1HAgoPrice(asset_id, exchange_currency);
            break;
        case "1DAY":
            
    console.log(duration_id);
            previous_price = await get1DAgoPrice(asset_id, exchange_currency);
            break;
        case "1WEK":
            
    console.log(duration_id);
            previous_price = await get1WAgoPrice(asset_id, exchange_currency);
            break;
        case "1MTH":
            
    console.log(duration_id);
            previous_price = await get1MAgoPrice(asset_id, exchange_currency);
            break;
        case "1YER":
            
    console.log(duration_id);
            previous_price = await get1YAgoPrice(asset_id, exchange_currency);
            break;
    } */

    console.log("Previous price: " + previous_price);

    const diff = current_price - previous_price;

    console.log("C - " + current_price);
    console.log("P - " + previous_price);
    
    percentage_change = (diff*100) / current_price;

    console.log("%%%% -> " + percentage_change);

    return Math.round((percentage_change + Number.EPSILON) * 100) / 100;
}

export const getDefaultStartPeriod = () => { 
    var startPeriod = new Date();
    startPeriod.setDate(startPeriod.getDate() - 1);
    return startPeriod;
}

export const getStartPeriod = (duration_id, time_period_end) => {
    var time_period_start;
    time_period_start = new Date(time_period_end);

    switch(duration_id) {
        case "1HRS":
            console.log(duration_id);
            time_period_start.setHours(time_period_start.getHours() - 1);
            break;
        case "1DAY":
            console.log(duration_id);
            time_period_start.setDate(time_period_start.getDate() - 1);
            break;
        case "1WEK":
            console.log(duration_id);
            time_period_start.setDate(time_period_start.getDate() - 7);
            break;
        case "1MTH":
            console.log(duration_id);
            time_period_start.setDate(time_period_start.getDate() - 30);
            break;
        case "1YER":
            console.log(duration_id);
            time_period_start.setFullYear(time_period_start.getFullYear() - 1);
            break;
    }
    return time_period_start;
}

export const getDefaultEndPeriod = () => { 
    /* // patch for internal server error of Coin API 
    var date = new Date();
    date.setDate(date.getDate() - 10);
    // prendo i dati di 5 giorni fa che coin api ancora funzionava
    return date; */
    return new Date(); 
}

export const getPeriod = (duration_id) => {
    var period;

    // according to the specified conventions...
    switch(duration_id) {
        case "1HRS":
            console.log(duration_id);
            period = "2MIN";
            break;
        case "1DAY":
            console.log(duration_id);
            period = "1HRS";
            break;
        case "1WEK":
            console.log(duration_id);
            period = "8HRS";
            break;
        case "1MTH":
            console.log(duration_id);
            period = "1DAY";
            break;
        case "1YER":
            console.log(duration_id);
            period = "10DAY";
            break;
    }

    return period;
}

export const getPlotRate = async (asset_id, exchange_currency, period_id, time_period_start, time_period_end) => {
    // return a list of plottable results
    let rates = [];

    console.log("PERIOD: " + period_id);
    console.log("START: " + time_period_start);
    console.log("END: " + time_period_end);

    console.log("START ISO: " + time_period_start.toISOString());
    console.log("END ISO: " + time_period_end.toISOString());

    const response = await fetch(`https://rest.coinapi.io/v1/exchangerate/${asset_id}/${exchange_currency}/history?period_id=${period_id}&time_start=${time_period_start.toISOString()}&time_end=${time_period_end.toISOString()}&&apiKey=${process.env.API_KEY}`);

    const exchangerateList = await response.json();

    console.log("EXC LIST ->" + exchangerateList);

    try {
        rates = exchangerateList.map(item => { return item.rate_open; });
    } catch (error) {
        console.log(error.message);
    }

    return rates;
}