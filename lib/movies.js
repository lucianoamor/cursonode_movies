/* eslint-disable semi */
"use strict";

const fdebug = require("./fdebug");
const debug = fdebug("movies:lib:movies");
const http = require("http");

function Movies(main) {
    this.db = main.db;
    debug('init');
}





Movies.prototype.search = function(obj){
    var self = this;

    debug("search called: "+JSON.stringify(obj));

    return new Promise((resolve, rejec)=>{

        let query = {};

        if(obj.title) query.Title = new RegExp(obj.title);
        if(obj.year) query.Year = obj.year;
        if(obj.id) query.imdbID = obj.id;

        self.db.movies.find(query, {}, (err, docs)=>{
            err ? reject(err) : resolve(docs);
        })

    });
}

Movies.prototype.save = function(obj){
    var self = this;

    debug("save called: "+JSON.stringify(obj));

    return new Promise((resolve, rejec)=>{

        let query = {};

        self.db.movies.save(obj, {}, (err, docs)=>{
            err ? reject(err) : resolve(docs);
        })
       
    });
}

Movies.prototype.omdb = function(title) {

    var options = {
      hostname: 'www.omdbapi.com',
      port: 80,
      path: '/?t=' + title + '&y=&plot=short&r=json',
      method: 'GET'
    };

    return new Promise((resolve, rejec)=>{

        debug("omdb called "+title);

        var req = http.request(options, (res) => {
            res.on('data', (data) => {
                var movie = JSON.parse(data);    
            });
            res.on('end', () => {
                resolve(movie);        
            })
        });

        req.on('error', (e) => {
            debug("omdb request error "+e.message);
            console.log(`problem with request: ${e.message}`);
        });
        req.end();       

    });
}

module.exports = Movies;