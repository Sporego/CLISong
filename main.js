// NPM Load Block
const inquirer = require("inquirer");
const mysql = require("mysql");
const FuzzySearch = require("fuzzy-search"); //Make Later

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "1stLightofDay",
  database: "top_songsdb"
});

// connection.connect(function(err) {
//   if (err) throw err;
//   console.log("connected as id " + connection.threadId);

//   connection.query("SELECT * FROM top5000", function(err, res) {
//     if (err) throw err;
//     console.log(res);
//   });

//   connection.end();
// });

function findArtist() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "artist",
        message: "Name of Artist: "
      }
    ])
    .then(findArtist => {
      console.log("Searching '" + findArtist.artist + "'");
      connection.query(
        "SELECT * FROM top5000 WHERE ?",
        {
          artist: findArtist.artist
        },
        function(err, res) {
          if (err) throw err;
          // Log all results of the SELECT statement
          console.log(res);
          connection.end();
        }
      );
    });
}

function findPopularArtist() {
  connection.query(
    "SELECT * FROM top5000 GROUP BY artist HAVING count(*) > 1",
    function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      connection.end();
    }
  );
}

function findRange() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "lower",
        message: "Lowest Rank"
      },
      {
        type: "input",
        name: "upper",
        message: "Highest Rank"
      }
    ])
    .then(range => {
      console.log("Searching from " + range.lower + "to " + range.upper);
      connection.query(
        "SELECT * FROM top5000 WHERE id BETWEEN ? AND ?",
        {
          id: range.lower
        },
        {
          id: range.upper
        },
        function(err, res) {
          if (err) throw err;
          // Log all results of the SELECT statement
          console.log(res);
          connection.end();
        }
      );
    });
}

function main() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "mainSelect",
        choices: [
          "Find Artist",
          "Find 'Popular' Artist",
          "Find Range",
          "Find Song"
        ],
        message: "Select Query Type"
      }
    ])
    .then(main => {
      if (main.mainSelect === "Find Artist") {
        findArtist();
      }
      if (main.mainSelect === "Find 'Popular' Artist") {
        console.log("Searching artist's who appear more then once!");
        findPopularArtist();
      }
      if (main.mainSelect === "Find Range") {
        findRange();
      }
      if (main.mainSelect === "Find Song") {
        console.log("Not Made");
      }
    });
}

main();
