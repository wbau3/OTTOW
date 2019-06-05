
const https = require('https');

var title ="";


var movie  = {
  Title: "",
  Rating: "",
  RTperc: "",
  Budget: "",
  Domestic: "",
  Foreign: ""

};



main();


async function main(){
  


var step1 = await getInput();
var step2 = await getURLs(step1);
var printwait = await print(step2);

}
//console.log("title variable: " + title);


async function getInput() {
  
  return new Promise(resolve => {
  console.log("Enter title:");

    process.stdin.setEncoding('utf8');

    process.stdin.on('readable', () => {
      let chunk;
  // Use a loop to make sure we read all available data.
      while ((chunk = process.stdin.read()) !== null) {

          title += chunk;
  }
        //trim newline character from end of input
        title = title.substring(0, title.length - 1);
        resolve();
});
  

}); // end of promise
}





async function getURLs(waiting) {

  
  return new Promise(resolve => {

  var imdbURL = "";
  var rtURL = "";
  var bomURL = "";
  var searchURLimdb = "";
  var searchURLrt = "";
  var searchURLbom = "";
  var words = [];
  var indexEnd = "";

  //split input into individual words and create google search url
    words = title.split(" ");
    googleURL = "https://www.google.com/search?q=";
    if(words.length > 1){
      for(i = 0; i < words.length; i++){
          googleURL += words[i].toLowerCase() + "+";
      } 
      searchURLimdb = googleURL + "imdb";
      searchURLrt = googleURL + "rottentomatoes";
      searchURLbom = googleURL + "boxofficemojo";
      
    } else{
        searchURLimdb = googleURL + words[0].toLowerCase() + "imdb";
        searchURLrt = googleURL + words[0].toLowerCase() + "rottentomatoes";
        searchURLbom = googleURL + words[0].toLowerCase() + "boxofficemojo";
        
    }

  //make google http request and grab imdbURL
    https.get(searchURLimdb, (resp) => {
        data = '';
    

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {

          var resultIndex = data.indexOf("https://www.imdb.com/title/");
          if(data.charAt(resultIndex + 37 == '/')){
            imdbURL = data.slice(resultIndex, resultIndex + 37);
            //console.log("37: " + imdbURL);
            getIMDBdata(imdbURL);
          } else {
             imdbURL = data.slice(resultIndex, resultIndex + 38);
             //console.log("38: " + imdbURL);
             getIMDBdata(imdbURL);
          }
        
      })

    });


  //make google http request and grab rtURL
    https.get(searchURLrt, (resp) => {
      data = '';
  

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {

          resultIndex = data.indexOf("https://www.rottentomatoes.com/");
          var indexEnd = data.indexOf('&', resultIndex);

           rtURL = data.slice(resultIndex, indexEnd);
           //console.log("38: " + imdbURL);
           getRTdata(rtURL);
        
    })

  });


  //make google http request and grab bomURL

  https.get(searchURLbom, (resp) => {
    var bdata = '';


  resp.on('data', (chunk) => {
    bdata += chunk;
  });

  resp.on('end', () => {

      resultIndex = bdata.indexOf("https://www.boxofficemojo.com/");
      indexEnd = bdata.indexOf("htm", resultIndex);
      var codedURI = bdata.slice(resultIndex, indexEnd + 3);
      bomURL = decodeURIComponent(codedURI);
      //bomURL = "https://www.boxofficemojo.com/movies/?id=matrix.htm";
      getBOMdata(bomURL);
    
  })

});
      resolve(waiting);
  });//end of promise
}


  //make imdb http request

async function getIMDBdata(imdbURL){
  return new Promise(resolve => {

https.get(imdbURL, (resp) => {
  data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
      
      movie.Title = data.slice((data.indexOf("<title>") + 7), data.indexOf("-", data.indexOf("<title>")) - 1);
      var ratingIndex = data.indexOf('ratingValue');
      movie.Rating = data.substring(ratingIndex + 15, ratingIndex + 18);
    //console.log("Title: " + title + " Rating:" + rating);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

  resolve();
}); //end of promise
}


async function getRTdata(rtURL) {
  return new Promise(resolve => {


  https.get(rtURL, (resp) => {
    rtData = '';

  //A chunk of data has been received.
  resp.on('data', (chunk) => {
    rtData += chunk;
    
  });

  //The whole response has been received. Print out the result.
  resp.on('end', () => {

    var rotRatingIndex = rtData.indexOf("ratingValue");
    movie.RTperc = rtData.slice(rotRatingIndex + 13, rotRatingIndex + 15);
    //console.log("Rotten tomatoes rating: " + rotRating + "%");
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
  
    resolve();
}); //end of promise

}// end of getRT



async function getBOMdata(bomURL) {
  return new Promise(resolve => {


  https.get(bomURL, (resp) => {
    data = '';

  //A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
    
  });

  //The whole response has been received. Print out the selected data.
  resp.on('end', () => {

    var budgetIndex = data.indexOf("$", data.indexOf("Production Budget:"));
    var domesticIndex = data.indexOf("$", data.indexOf("Domestic Total Gross:"));
    var foreignIndex = data.indexOf("$", data.indexOf("Foreign:"));

    movie.Budget = data.slice(budgetIndex, data.indexOf("<", budgetIndex));
    movie.Domestic = data.slice(domesticIndex, data.indexOf("<", domesticIndex));
    movie.Foreign = data.slice(foreignIndex, data.indexOf("<", foreignIndex));
    
    //console.log(movie);
    
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
  
    resolve();
}); //end of promise

}// end of getBOMdata


async function print(){
  return new Promise(resolve => {

      console.log(movie);

      resolve();
    loop();
  });

}



function loop(){
  
  
  movie.Title = "";
  movie.Rating = "";
  movie.RTperc = "";
  movie.Budget = "";
  movie.Domestic = "";
  movie.Foreign = "";
  
main();

} // end of loop function



/*
To do

-Display director




*/


