// importing the dependencies
import express    from "express";
import bodyParser from 'body-parser';
import cors       from 'cors';
import helmet     from 'helmet';
import mongoose   from 'mongoose';
import dotenv     from 'dotenv';

// importing routes to endpoints
import assetRoutes from './routes/asset.routes.js';
//import exchangeRoutes from './routes/exchange.routes.js';

// importing coinAPI inizializer
import CoinAPI from './coin_api/coinapi.js';

// defining the Express app
const app = express();

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// View engine setup
app.set('view engine', 'html');
// root endpoint -> segnala che il server è attivo
app.get('/', (req, res) => {
    //res.json({'message': 'Server is working!'});
    res.render('./views/index.html');
})

// setup assets user's list routes endpoints: localhost:4000/userList/assets
app.use('/userList/assets', assetRoutes);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});

    return;
});


// setup MongoDB Atlas connection
dotenv.config(); 
mongoose.connect(process.env.CONNECTION_URI, { dbName:'db_test_pdgt', useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("connected to mongoDB Atlas, URI: " + process.env.CONNECTION_URI);
            // starting the server
            app.listen(process.env.PORT || 4000, () => {
                console.log("server listen on port " + 4000);
                
                // to fetch all data and update MongoDB collections
                CoinAPI();
            });
        })
        .catch((error) => { console.log(error.message) });