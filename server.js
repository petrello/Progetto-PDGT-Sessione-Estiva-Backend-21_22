// importing the dependencies
import express from "express";
import bodyParser from 'body-parser';
import cors      from 'cors';
import helmet        from 'helmet';
import morgan        from 'morgan';
import mongoose      from 'mongoose';
import dotenv        from 'dotenv';

// importing routes to endpoints
import assetRoutes from './routes/asset.routes.js';
import exchangeRoutes from './routes/exchange.routes.js';

// importing coinAPI inizializer
import CoinAPI from './coinapi.js';

// defining the Express app
const app = express();

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// setup asset routes endpoints from:  localhost:4000/asset
app.use('/asset', assetRoutes);
// TODO: setup icons routes /icons
// setup exchange routes endpoints from:  localhost:4000/exchange
app.use('/exchange', exchangeRoutes);

// setup MongoDB Atlas connection
dotenv.config(); 
mongoose.connect(process.env.CONNECTION_URI, { dbName:'db_test_pdgt', useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("connected to mongoDB Atlas, URI: " + process.env.CONNECTION_URI);
            // starting the server
            app.listen(process.env.PORT || 4000, () => {
                console.log("server listen on port " + process.env.PORT);
                
                // to fetch all data and update MongoDB collections
                CoinAPI();
            });
        })
        .catch((error) => { console.log(error.message) });