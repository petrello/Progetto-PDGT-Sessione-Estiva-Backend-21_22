 - body-parser: This dependency will be used to convert the base of incoming applications into JavaScript objects.

 - cors: Cross-Origin Resource Sharing(CORS) is a dependency that is used to configure Express to combine headers specifying that your Rest API accepts requests from any source.

 - express: This dependency denotes the Express library.

 - helmet: This module establishes different HTTP headers to safeguard Express APIs.
 
 - morgan: This package extends your Express Rest API’s logging capabilities.


## TODO 0
crea il modello con cui deve interagire l'utente

- lista di asset ({type_is_crypto : 1})
    * per ogni asset voglio
            + icona (ce l'ho)
            + nome (ce l'ho)
            + sigla (ce l'ho)
            + valuta di exchange che definisce l'utente (ce l'ho) ({type_is_crypto : 0})
            + % change (me lo devo calcolare -> vedi TODO 1)
            + grafico giornaliero 1D (24h)

            ---------------------------
            AZIONI
            + delete -> voglio elminare asset da lista
            + press -> voglio poter vedere i valori dei plot /frontend
            + click -> voglio andare alla pagina dei dettagli /frontend
            
            ---------------------------
            ESEMPIO SCHEDA ASSET
            icona -> get asset_icon/:asset_id/asset.url (campo url-> accedo ad icona)
            nome -> get assets/:asset_id/asset.name  - BITCOIN
            sigla -> get assets/:asset_id/asset.asset_id  - BTC
            valuta -> get assets/:asset_id/asset.price_usd - USD
            % -> get percentage - +0.23% (me lo devo calcolare io)
            grafico -> exchangerate/BTC/USD/history

 ## TODO 1
 // API GET
 CALCULATE PERCENTAGE CHANGE
 es: 24h -> BTC current: 14988, BTC 24h ago: 14937 
            14988-14937=51
            14988:51=100:x -> +0,34%
 es: (in negativo)
        BTC current: 14988, BTC 24h ago: 20000
        14988-20000 = -5012
        14988:-5012=100:x -> -33,44%

HO 4 VARIABILI:   
        durata      (es: 24h, 1w, 1m, 1d)
        asset       (es: BTC, ETH)    
        price       (14000)
        priceago    (20000)

FORMULA: 14988-14937=51
            14988:51=100:x -> +0,34%

OUTPUT: +0,34 OPPURE -0,34


## TODO 2
// API GET
PRENDI I DATI PER IL PLOT DEL GRAFICO
devo specificare il periodo: 1y, 1m, 1w, 1d
period_id -> voglio un prezzo ogni ora, giorno, minuto
time_start -> tempo inizio grafico
time_end -> tempo fine grafico

/exchangerate/BTC/USD/history -> ottengo grafico prezzi di btc in dollari
{
        "time_period_start": "2022-01-01T00:00:00.0000000Z",
        "time_period_end": "2022-01-01T01:00:00.0000000Z",
        "time_open": "2022-01-01T00:00:00.0000000Z",
        "time_close": "2022-01-01T00:59:00.0000000Z",
        "rate_open": 46181.53857300336,
        "rate_high": 46710.42593744825,
        "rate_low": 46181.53857300336,
        "rate_close": 46667.94208337493
},
"rate_open": 46181.53857300336, -> BTC vale 46181 $


## TODO 3
// GET API
VOGLIO OTTNERE IL GRAFICO PER OGNI ASSET CHE
L'UTENTE HA NELLA HOME -> LA VALUTA DI CONVERSIONE 
ME LA SPECIFICA L'UTENTE

=> forEeach ELEMENT in USER_LIST -> fetch hystory

DEFAULT -> 24 PUNTI IN UNA GIORNATA (quella in cui si apre l'app)

NELLA PAGINA DEGI DETTAGLI POSSIAMO MODIFICARE IL PERIODO
E AUTOMATICAMENTE DEVO ADATTARE IL CAMPIONAMENTO CORRETTO 
(es: utente cambia da 1D a 1Y => io cambio da 24 campioni a 4*12 = 48 -> 4 valori al mese)


##  TODO 4
SPOSTARE TUTTI I MODELS, CONTROLLERS, ROUTES E COINAPI
IN UNA CARTELLA DEDICATA -> ES: COINAPI_HELPERS