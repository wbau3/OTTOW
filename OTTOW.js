//ratingValue field in JSON data on imdb. 


const https = require('https');

https.get('https://www.imdb.com/title/tt2911666/', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
      
      var ratingIndex = data.indexOf('ratingValue');
      var yearIndex = data.indexOf('datePublished');
      var year = data.substring(yearIndex + 17, yearIndex + 21);
      var rating = data.substring(ratingIndex + 15, ratingIndex + 18);
    console.log("Rating:" + rating + ' ' + 'Year: ' + year);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});



/*
To do
General
    -Actors/actresses
    -Links to all pages for the movie
    -Release year
    -MPAA Rating
    -Personal watch list

-Locate correct IMDB page from search term
-Grab ratingValue field
-Display year for the movie
-Display director??

-Get rotten tomatoes score

-Box Office Mojo info??
    -Gross income
    - ..?


*/


