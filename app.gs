

var ss = SpreadsheetApp.openById("1MlRaizP0oCeQfnH-YyyipBz_Jx-zJhAqfr3zgXhoqBI");
var sheet = ss.getSheetByName("db");


// func doget permet l'init d'un page HTML pour la web app


function doGet(e) {
  var params = e.parameter;
  var template = HtmlService.createTemplateFromFile("webapp");
    Logger.log(params);
    template.data = JSON.stringify(params)
    return template.evaluate();
}

// permet de récupérer les valeurs renseigné dans la feuille platforms afin d'ajouter des indices ou régions suplémentaires a voir en détail pour la créa d'artice oubien la recherche 


function getPlatforms() {
  var sheet = ss.getSheetByName("platforms");
  return sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues();
}


/**
 * Find matching resources based on user input
 * @param {Object} formObject
 * @param {string} formObject.indice
 * @param {string} formObject.nom
 * @returns {Object[]} results
*/


// func permetant la recherche des données avec le champs de recherche depuis la page web

function getResources(formObject) {
  Logger.log(formObject);
  var results = [];
  var db = ss.getSheetByName('db');
  var data = db.getRange(2,1,db.getLastRow(),db.getLastColumn()).getValues();

  // find matching resources
  for(var i=0; i<data.length; i++) {
    if(data[i][0].toLowerCase() == formObject.platform.toLowerCase()) {
      if(!formObject.nom) {

        results.push(
          {
            nom: data[i][1],
            prenom: data[i][2],
            mail: data[i][3],
            agent: data[i][4],
            gn: data[i][5],
            citrix: data[i][6],
            description: data[i][7]
          }
        )
      } else {
        var tags = formObject.nom.split(",");
        for(var n in tags) {
          if(data[i][1].toLowerCase().indexOf(tags[n].toLowerCase()) > -1) {
            results.push(
              {
                nom: data[i][1],
                prenom: data[i][2],
                mail: data[i][3],
                agent: data[i][4],
                gn: data[i][5],
                citrix: data[i][6],
                description: data[i][7]
              }
            )
          }
        }
      }
    }
  }
  Logger.log(results);
  return results;
}

function addNewArticle(formObject) {
  if(formObject.nom == "" || formObject.description == "" || formObject.prenom == "") {
    throw new Error("Merci de remplir les champs obligatoire.");
  }

  try {
    var sheet = ss.getSheetByName('db');
    var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1;

    Logger.log(formObject);

    sheet.getRange(nextRow, 1, 1, 8).setValues([ [formObject[headers[0]], formObject[headers[1]], formObject[headers[2]], formObject[headers[3]], formObject[headers[4]], formObject[headers[5]], formObject[headers[6]], formObject[headers[7]] ] ]);

    return "Poste des données DONE !!."
  } catch(e) {
    return e.message;
  }
}

function getAuth() {
  var user = Session.getActiveUser().getEmail();
  var sheet = ss.getSheetByName('authUsers');
  var users = sheet.getRange(1,1,sheet.getLastRow(), 1).getValues();

  Logger.log(users);
  Logger.log(users[0].indexOf(user));
  if(users[0].indexOf(user) > -1) {
    return true;
  } else {
    return false;
  }
}
