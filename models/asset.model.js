import mongoose from "mongoose";

const assetSchema = new mongoose.Schema( {
    asset_id: String,
    name: String,
    icon: String,
    percentage_change: Number,
    price: Number,
    exchange_currency: String,
    time_period_start: Date,
    time_period_end: Date,
    plot_rate: [Number],
}, { collection: 'user_assets_list'} );

/* transforming Schema into a Model */
const AssetModel = mongoose.model('AssetModel', assetSchema);

/* exporting just the Model */
export default AssetModel;