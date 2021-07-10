const requestJson = require('request-json');

function getDivisas(req, res){
  console.log("GET https://api.exchangeratesapi.io/latest");

  var httpClient = requestJson.createClient("https://api.exchangeratesapi.io/");
  console.log("Client created");

  httpClient.get("latest",
    function(err, body) {
      var response = !err ? body : {
        "msg" : "Error obteniendo divisas."
      }
      res.send(JSON.parse(response.body));
    }
  )
}

module.exports.getDivisas = getDivisas;
