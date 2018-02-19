// Import MySQL connection js 
var connection = require ('./connection.js');

//Help Function for SQL Syntax
//Creates array of question marks and then tunrs them into a string.
function printQuestionMarks(num) {
    var arr = [];
  
    for (var i = 0; i < num; i++) {
      arr.push("?");
    }
  
    return arr.toString();
  }
  
  // Helper function to convert object key/value pairs to SQL syntax
  function objToSql(ob) {
    var arr = [];
  
    // loop through the keys and push the key/value as a string int arr
    for (var key in ob) {
      var value = ob[key];
      // check to skip hidden properties
      if (Object.hasOwnProperty.call(ob, key)) {
        // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
        if (typeof value === "string" && value.indexOf(" ") >= 0) {
          value = "'" + value + "'";
        }
        // e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
        // e.g. {sleepy: true} => ["sleepy=true"]
        arr.push(key + "=" + value);
      }
    }
  
    // translate array of strings to a single comma-separated string
    return arr.toString();
  }
  


  // Object for all our SQL statement functions.
  var orm = {
     //function that reurns all tables
    selectAll: function(tableInput, cb) {
        // Construct the query string that returns all rows from the target table
        var queryString = "SELECT * FROM " + tableInput + ";";

            // perform database query
            connection.query(queryString, function(err, result) {
                if (err) {
                    throw err;
                }
                // return results in callback
                cb(result);
            });
    },


    insertOne: function(table, cols, vals, cb) {
      // construct the query string that inserts a single row into the target table
      var queryString = "INSERT INTO " + table;
  
      queryString += " (";
      queryString += cols.toString();
      queryString += ") ";
      queryString += "VALUES (";
      queryString += printQuestionMarks(vals.length);
      queryString += ") ";
  
      console.log(queryString);
      
      // Perform the database query
      connection.query(queryString, vals, function(err, result) {
        if (err) {
          throw err;
        }
        
        //Return results in callback
        cb(result);
      });
    },

    // An example of objColVals would be {name: panther, sleepy: true}
    // Function that updates a single table entry
    updateOne: function(table, objColVals, condition, cb) {
      // Contruct the query string that updates a single entry in the target table
      var queryString = "UPDATE " + table;
  
      queryString += " SET ";
      queryString += objToSql(objColVals);
      queryString += " WHERE ";
      queryString += condition;
      
      // Perform the database query
      console.log(queryString);
      connection.query(queryString, function(err, result) {
        if (err) {
          throw err;
        }
  
        cb(result);
      });
    }
  };
  
  // Export the orm object for the model (cat.js).
  module.exports = orm;
  