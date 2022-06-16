import mongoose from "mongoose";

const assetIconDTOSchema = new mongoose.Schema( {
    asset_id: String,
    url: String
}, { collection: 'asset_icons'} );

/* transforming Schema into a Model */
const AssetIconDTO = mongoose.model('AssetIcon', assetIconDTOSchema);

/* exporting just the Model */
export default AssetIconDTO;