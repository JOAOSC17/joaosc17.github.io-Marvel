const timeStamp = '1622574706';
const publicKey = 'a84ccf136a54436ed0babf6a4d8a5433';
const privateKey = '00fa707a16290895dbe94503f543454a755830a9';
const hash = '2e4f386b0fd325fcc7db20af85ed7759';
function character() {
let urlQueryParameters = new URLSearchParams(window.location.search),
    queryParameterName = urlQueryParameters.get("name"),
    name = document.getElementById("name").value;

  if (queryParameterName !== null && queryParameterName !== "") {
    document.getElementById("name").value = queryParameterName;
    connection();
  } else if (name !== null && name !== "") {
    document
      .getElementById("connectionForm")
      .addEventListener("submit", connection);
  } else {
    document.getElementById("characterSection").innerHTML =
      '<h2 id="characterMainTitle">Enter search term above...</h2>';
  }
}

function connection() {
  document.getElementById("characterSpinnerSection").innerHTML = "";
  document.getElementById("comicsSpinnerSection").innerHTML = "";
  var name = document.getElementById("name").value;
  var params = "name=" + name;
  fetch(`https://gateway.marvel.com:443/v1/public/characters?${params}&ts=${timeStamp}&apikey=${publicKey}&hash=${hash}`).then(function(response) {
    if(response.ok) {
      response.json().then(function(jsonParsed) {
        //var objectURL = URL.createObjectURL(jsonParsed);
        //myImage.src = objectURL;
        const results = jsonParsed;
   console.log(results["data"]);

  if (results["data"].count === 0) {
    document.getElementById("characterSection").innerHTML =
      '<h2 id="characterMainTitle"><span style="font-weight:bold;">No results for... ' +
      name +
      "</span>" +
      ". Try again.</h2>";

    document.getElementById("characterSpinnerSection").innerHTML = "";

    document.getElementById("comicsSpinnerSection").innerHTML = "";
  } else if (results === undefined || results.length == 0) {
    document.getElementById("characterSection").innerHTML =
      '<h2 id="characterMainTitle">' +
      "An error might have occured on our end, Sorry. <br>In this case, try again later.</h2>";

    document.getElementById("characterSpinnerSection").innerHTML = "";

    document.getElementById("comicsSpinnerSection").innerHTML = "";
  } else {
    var characterAttributes = results["data"].results[0];
    var characterID = results["data"].results[0].id;
    var output = "";

    output +=
      '<h2 id="characterMainTitle">' +
      "Character" +
      "</h2>" +
      '<div class="card flex-md-row mb-4 box-shadow h-md-250" id="characterCard">' +
      '<div id="characterImage">' +
      '<img class="card-img-right flex-auto d-md-block img-fluid"' +
      ' alt="Picture of ' +
      characterAttributes.name +
      '" src="' +
      characterAttributes.thumbnail["path"] +
      "." +
      characterAttributes.thumbnail["extension"] +
      '">' +
      "</div>" +
      '<div class="card-body d-flex flex-column align-items-start">' +
      '<h3 class="mb-0 text-dark" id="characterName">' +
      characterAttributes.name +
      "</h3>" +
      '<p class="card-text mb-3" id="characterDescription">';
    if (characterAttributes.description !== "") {
      output += characterAttributes.description;
    }
    output +=
      "</p>" +
      '<p class="text-muted mb-3" id="comicsAvailable">' +
      "Comics: " +
      characterAttributes.comics.available +
      " | " +
      "Series: " +
      characterAttributes.series.available +
      " | " +
      "Stories: " +
      characterAttributes.stories.available +
      " | " +
      "Events: " +
      characterAttributes.events.available +
      "</p>" +
      '<p class="mb-1 text-muted" id="characterInfoAttribution">' +
      results["attributionText"] +
      "</p>" +
      "</div>" +
      "</div>";

    document.getElementById("characterSection").innerHTML = output;

    comics(characterID);
    console.log(jsonParsed);
  }
      });
    } else {
      console.log('Network response was not ok.');
    }
  })
  .catch(function(error) {
    console.log('There has been a problem with your fetch operation: ' + error.message);
  });


   function comics(characterID) {
      // var id = document.getElementById('comicid');
      // var comicid = comic.id;
      // var characterID = "" + comicid;
   fetch(`https://gateway.marvel.com:443/v1/public/characters/${characterID}/comics?&ts=${timeStamp}&apikey=${publicKey}&hash=${hash}`).then(function(response) {
    if (response.ok) {
      response.json().then(function(jsonParsed) {
      const results = jsonParsed;
      console.log(results["data"]);
       const comics = results["data"].results;
       const comicSection = document.getElementById("comicSection");

      console.log(results)
      console.log(comics)

       if (results["data"] == 0) {
         let output = "";
         comicSection.innerHTML = output;
         comicSection.innerHTML = "<h2>No comics Available</h2>";
       } else {
       //comics available
         let output = "";
         let creators = "";

           output +=
           '<h2 id="comicMainTitle">Comics</h2>' + '<div class="card-columns">';

           for (const i in comics) {
            if (comics.hasOwnProperty(i)) {
              const comic = comics[i];
              const comicID = comic.id;
              output +=
                '<div class="card">' +
                '<a href="./comic.html?comic-id=' +
                comicID + 
                '"><img src="' +
                comic.thumbnail["path"] +
                "." +
                comic.thumbnail["extension"] +
                '" class="card-img-top" alt="' +
                comic.title +
                '"></a>' +
                '<div class="card-body">' +
                '<h5 class="card-title">' +
      
                '<i class="fas fa-plus float-right" onclick="Favorite()" ></i>'+
                comic.title +
                "</h5>";
  
              if (comic.description != null) {
                output +=
                  '<p style="font-size: 12px;" class="card-text">' +
                  comic.description +
                  "</p>";
              }
  
              output +=
                '<p style="font-size: 12px;" class="card-text text-muted">Characters: ';
  
              for (const k in comic.characters.items) {
                if (comic.characters.items.hasOwnProperty(k)) {
                  const character = comic.characters.items[k];
                  output += character.name.concat(", ");
                }
              }
  
              output += "</p>";
              output +=
                '<p style="font-size: 12px;" class="card-text text-muted">Creators: ';
  
              for (const j in comic.creators.items) {
                if (comic.creators.items.hasOwnProperty(j)) {
                  const creator = comic.creators.items[j];
  
                  output += creator.name.concat(" (" + creator.role + "), ");
                }
              }
  
              output += "</p>";
              output +=
                "</div>" +
                '<div class="card-footer">' +
                '<small style="line-height: 1;" class="text-muted">' +
                results["attributionText"] +
                "</small>" +
                "</div>" +
                "</div>";
                singleComic(comicID);
              }
         }

         output += "</div>";

         comicSection.innerHTML = output;            
        }
     });
     } else {
       document.getElementById("characterSection").innerHTML =
         '<h2 id="characterMainTitle">Request not received</h2>';
       document.getElementById("comicSection").innerHTML =
         '<h2 id="characterMainTitle">Request not received</h2>';
     }
   })
   .catch(function(error) {
     console.log('There has been a problem with your fetch operation: ' + error.message);
   });

  }

}
