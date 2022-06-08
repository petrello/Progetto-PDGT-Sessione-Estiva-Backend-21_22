import mongoose from "mongoose";

const assetIconSchema = new mongoose.Schema( {
    asset_id: String,
    url: String
}, { collection: 'asset_icons'} );

/* transforming Schema into a Model */
const AssetIcon = mongoose.model('AssetIcon', assetIconSchema);

/* exporting just the Model */
export default AssetIcon;