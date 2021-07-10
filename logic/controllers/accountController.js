const baseMLabURL = "https://api.mlab.com/api/1/databases/apitechuama13ed/collections/";
const requestJson = require('request-json');
const mLabAPIKey = "apiKey=" + process.env.MLAB_API_KEY;

function getAccountsV2(req, res) {
  console.log("GET /apitechu/v2/accounts/:id");

  var httpClient = requestJson.createClient(baseMLabURL);

  var id = Number.parseInt(req.params.id);

  console.log("La id es: " + id);

  var query = "q=" + JSON.stringify({"UserId":id});

  httpClient.get("accounts?" + query + "&" + mLabAPIKey,
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

function checkAccountExitsV2(req, res) {
  console.log("GET /apitechu/v2/checkAccount/:iban");

  var httpClient = requestJson.createClient(baseMLabURL);

  var iban = req.params.iban;

  if (iban.includes("%20")){
    iban.replace(/%20/g, " ");
  }

  console.log("El iban es: " + iban);

  var query = "q=" + JSON.stringify({"IBAN":iban});

  httpClient.get("accounts?" + query + "&" + mLabAPIKey,
    function(err, resMLab, body) {
      if (err) {
        var response = "Se ha producido un error al buscar la cuenta";
        res.status(500);
      } else {
        if (body.length > 0) {
          var response = body[0];
        } else {
          var response = {
            "msg" : "Cuenta no encontrada",
            "UserId": -1
          }
          res.status(404);
        }
      }

      res.send(response);
    }
  );
}

function createAccountV2(req, res) {
  console.log("POST /apitechu/v2/accounts");

  console.log(req.body);
  console.log(req.headers);
  console.log(req.body.UserId);
  console.log(req.body.IBAN);
  console.log(req.body.Balance);

  var newAccount = {
    "UserId": req.body.UserId,
    "IBAN": req.body.IBAN,
    "Balance": req.body.Balance
  }

  console.log(newAccount);

  var httpClient = requestJson.createClient(baseMLabURL);
  console.log("Client created");

  httpClient.post("accounts?" + mLabAPIKey, newAccount,
    function(err, resMLab, body) {
      console.log("Cuenta creada en mLab");
      res.status(201).send({"msg": "Cuenta creada"});
    }
  )
}

function deleteAccountV2(req, res) {
  console.log("PUT /apitechu/v2/accounts/:iban");
  console.log("IBAN de la cuenta a borrar es " + req.params.iban);

  var httpClient = requestJson.createClient(baseMLabURL);

  var iban = req.params.iban;

  if (iban.includes("%20")){
    iban.replace(/%20/g, " ");
  }

  var query = "q=" + JSON.stringify({"IBAN": iban});

  console.log("La query es " + query);

  httpClient.put("accounts?" + query + "&" + mLabAPIKey, [],
    function(err, resMLab, body) {
      var response = !err ? body : {
        "msg" : "Error borrando una cuenta"
      }
      res.send(response);
    }
  )
}

function modifyAccountBalanceV2(req, res) {
  console.log("PUT /apitechu/v2/accounts/:iban");
  console.log("IBAN de la cuenta a modificar es " + req.params.iban);
  console.log("El nuevo balance es " + req.body.Balance);

  var httpClient = requestJson.createClient(baseMLabURL);

  var iban = req.params.iban;
  var balance = req.body.Balance;

  if (iban.includes("%20")){
    iban.replace(/%20/g, " ");
  }

  var putBody = '{"$set": {"Balance":'+ balance +'}}';

  var query = "q=" + JSON.stringify({"IBAN": iban});

  console.log("La query es " + query);
  console.log("El body es " + putBody);

  httpClient.put("accounts?" + query + "&" + mLabAPIKey, JSON.parse(putBody),
    function(err, resMLab, body) {
      var response = !err ? body : {
        "msg" : "Error modificando una cuenta"
      }
      res.send(response);
    }
  )
}

module.exports.getAccountsV2 = getAccountsV2;
module.exports.createAccountV2 = createAccountV2;
module.exports.deleteAccountV2 = deleteAccountV2;
module.exports.modifyAccountBalanceV2 = modifyAccountBalanceV2;
module.exports.checkAccountExitsV2 = checkAccountExitsV2;
