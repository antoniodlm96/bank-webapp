const baseMLabURL = "https://api.mlab.com/api/1/databases/apitechuama13ed/collections/";
const requestJson = require('request-json');
const mLabAPIKey = "apiKey=" + process.env.MLAB_API_KEY;

function getTransactionsV2(req, res) {
  console.log("GET /apitechu/v2/transactions/:iban");

  var httpClient = requestJson.createClient(baseMLabURL);

  var iban = req.params.iban;

  if (iban.includes("%20")){
    iban.replace(/%20/g, " ");
  }

  console.log("El iban es: " + iban);

  var query = "q=" + JSON.stringify({"IBAN":iban});

  httpClient.get("transactions?" + query + "&" + mLabAPIKey,
    function(err, resMLab, body) {
      if (err) {
        var response = "Se ha producido un error al recuperar las cuentas";
        res.status(500);
      } else {
        if (body.length > 0) {
          var response = body;
        } else {
          var response = {
            "msg" : "Cuenta no encontrada"
          }
          res.status(404);
        }
      }

      res.send(response);
    }
  );
}

function createTransactionV2(req, res) {
  console.log("POST /apitechu/v2/transactions");

  console.log(req.headers);
  console.log(req.body.IBAN);
  console.log(req.body.Cantidad);

  var newTransaction = {
    "Mensaje": req.body.Mensaje,
    "IBAN": req.body.IBAN,
    "Cantidad": parseInt(req.body.Cantidad)
  }

  console.log(newTransaction);

  var httpClient = requestJson.createClient(baseMLabURL);
  console.log("Client created");

  httpClient.post("transactions?" + mLabAPIKey, newTransaction,
    function(err, resMLab, body) {
      console.log("Transaccion creada en mLab");
      res.status(201).send({"msg": "Transaccion creada"});
    }
  )
}

module.exports.getTransactionsV2 = getTransactionsV2;
module.exports.createTransactionV2 = createTransactionV2;
