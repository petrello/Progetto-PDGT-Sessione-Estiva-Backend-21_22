import mongoose from "mongoose";

const assetSchema = new mongoose.Schema( {
    asset_id: String,
    name: String,
    icon: String,
    percentage_change: Number,
    price: Number,
    exchange_currency: String,
    plot_rate: [Number],
}, { collection: 'user_assets_list'} );

/* transforming Schema into a Model */
const Asset = mongoose.model('Asset', assetSchema);

/* exporting just the Model */
export default Asset;