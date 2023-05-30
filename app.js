const express = require("express");
const app = express(); // instance created by the express object
app.use(express.json());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;

const dbPath = path.join(__dirname, "moviesData.db");

const initializeDBandServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("The server is running in the port 3000");
    });
  } catch (e) {
    console.log(`Error occur ${e}`);
  }
};

initializeDBandServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

//Get Request api returns list of all movie names
app.get("/movies/", async (request, response) => {
  try {
    const getMovieNamesQuery = `
     SELECT 
     movie_name  
     FROM
      movie
    ;`;
    let myMoviesArray = await db.all(getMovieNamesQuery);
    // myMoviesArray = myMoviesArray.map((dbObject) =>
    //   convertDbObjectToResponseObject(dbObject)
    // );
    response.send(
      myMoviesArray.map((dbObject) => ({ movieName: dbObject.movie_name }))
    );
  } catch (error) {
    console.log(`error occured ${error}`);
  }
});

// Get Request API returns a movie based on the movie_id
app.get("/movies/:movieId/", async (request, response) => {
  try {
    const { movieId } = request.params;

    const getMovieNamesQuery = `
     SELECT 
     *  
     FROM
      movie
      WHERE 
      movie_id = ${movieId}
    ;`;
    let myMovieObject = await db.get(getMovieNamesQuery);

    // response.send(convertDbObjectToResponseObject(myMovieObject));
    response.send(myMovieObject);
  } catch (error) {
    console.log(`error occured ${error}`);
  }
});
