import mongoose from "mongoose";

const exchangeSchema = new mongoose.Schema( {
    exchange_id: String,
    website: String,
    name: String,
    data_start: Date,
    data_end: Date,
    data_quote_start: Date,
    data_quote_end: Date,
    data_orderbook_start: Date,
    data_orderbook_end: Date,
    data_trade_start: Date,
    data_trade_end: Date,
    data_symbols_count: Number,
    volume_1hrs_usd: Number,
    volume_1day_usd: Number,
    volume_1mth_usd: Number
});

/* transforming Schema into a Model */
const Exchange = mongoose.model('Exchange', exchangeSchema);

/* exporting just the Model */
export default Exchange;