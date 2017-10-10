var fs = require("fs");

var keys = require("./keys.js");

var twitter = require("twitter");

var spotify = require("node-spotify-api");

var request = require("request");

var client = new twitter(keys.twitterKeys);

var inquirer = require("inquirer");




inquirer.prompt([{
        type: "list",
        name: "userInput",
        message: "Choose one of the following:",
        choices: ["Mytweets", "Spotify-this-song", "Movie-this", "Do-what-it-says"]
    }

]).then(function(user) {

    
    switch (user.userInput) {
        case "Mytweets":
            
            twentyTweets();
            
            break;

        case "Spotify-this-song":
            
            spotifySong();
            
            break;

        case "Movie-this":
            
            movie();
            
            break;

        case "Do-what-it-says":
            
            doThis();
           
            break;
    }

//displaying 20 tweets
    function twentyTweets() {
        var userName = { screen_name: "microsharad" };
        var i;
        client.get("statuses/user_timeline", userName, function(error, tweets, response) {
            if (!error) {
                for (i = 0; i < 20; i++) {
                    console.log(tweets[i].text);
                }
            } else { console.log("Error:  " + error); }
        })
    }

    function spotifySong() {
        inquirer.prompt([{
            type: "input",
            name: "spotifyName",
            message: "Which song you want to play on Spotify?"
        }]).then(function(user) {
            if (user.spotifyName === "") {
                user.spotifyName = "The Sign";
            }
            var songTitle = user.spotifyName;
            console.log("Spotifying:  " + songTitle);
            var client = new spotify({
                id: "f294629b61fb496b98ea055e06d82a0f",
                secret: "83e7719e49364b7898a82130bc2924aa"
            });
            client.search({ type: "track", query: songTitle }, function(error, data) {
                if (!error) {
                    console.log("Artist Name:  " + data.tracks.items[0].artists[0].name);
                    console.log("Song Name:  " + data.tracks.items[0].name);
                    console.log("Preview Link:  " + data.tracks.items[0].external_urls.spotify);
                    console.log("Album:  " + data.tracks.items[0].album.name);
                } else { console.log("Error:  " + error); }
            })
        });
    }

    function movie() {
        inquirer.prompt([{
            type: "input",
            name: "movieName",
            message: "Type the movie name."
        }]).then(function(user) {
            if (user.movieName === "") {
                console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            } else {
                var queryURL = "https://www.omdbapi.com/?t=" + user.movieName + "&y=&plot=short&apikey=40e9cece";
                request(queryURL, function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var body = JSON.parse(body);
                        console.log("Movie Title:  " + body.Title);
                        console.log("Year:  " + body.Year);
                        console.log("IMDB Rating:  " + body.imdbRating);
                        console.log("Rotten Tomatoes Rating:  " + body.tomatoRating);
                        console.log("Country of Origin:  " + body.Country);
                        console.log("Language:  " + body.Language);
                        console.log("Movie Plot:  " + body.Plot);
                        console.log("Actors:  " + body.Actors);
                    } else { console.log("Error:  " + error); }
                })
            }
        });
    }

    function doThis() {
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
                return console.log("Error:  " + error);
            }
            var spotifyN = data;
            console.log("Spotifying:  " + spotifyN);
            var client = new spotify({
                id: "f294629b61fb496b98ea055e06d82a0f",
                secret: "83e7719e49364b7898a82130bc2924aa"
            });

            client.search({ type: "track", query: spotifyN }, function(error, data) {
                if (!error) {
                    console.log("Artist Name:  " + data.tracks.items[0].artists[0].name);
                    console.log("Song Name:  " + data.tracks.items[0].name);
                    console.log("Preview Link:  " + data.tracks.items[0].external_urls.spotify);
                    console.log("Album:  " + data.tracks.items[0].album.name);
                } else { console.log("Error:  " + error); }
            })
        })
    }
});