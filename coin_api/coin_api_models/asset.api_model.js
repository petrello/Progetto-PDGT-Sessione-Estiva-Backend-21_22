import mongoose from "mongoose";

const assetDTOSchema = new mongoose.Schema( {
    asset_id: String,
    name: String,
    type_is_crypto: Number,
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
    volume_1mth_usd: Number,
    price_usd: Number
} );

/* transforming Schema into a Model */
const AssetDTO = mongoose.model('Asset', assetDTOSchema);

/* exporting just the Model */
export default AssetDTO;