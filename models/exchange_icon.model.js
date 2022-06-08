import mongoose from "mongoose";

const exchangeIconSchema = new mongoose.Schema( {
    exchange_id: String,
    url: String
}, { collection: 'exchange_icons'} );

/* transforming Schema into a Model */
const ExchangeIcon = mongoose.model('ExchangeIcon', exchangeIconSchema);

/* exporting just the Model */
export default ExchangeIcon;