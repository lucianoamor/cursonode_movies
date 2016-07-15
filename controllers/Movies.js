/* eslint-disable semi */
"use strict";

const fdebug = require("../lib/fdebug");
const debug = fdebug("movies:controllers:movies");


function Movies(main) {
    debug("init.");
    return {

        'search': (req, res, next)=>{
            debug(".search called");

            var title  = req.swagger.params.title ? req.swagger.params.title.value : null;
            var year  = req.swagger.params.year ? req.swagger.params.year.value : null;
            var id  = req.swagger.params.id ? req.swagger.params.id.value : null;

            main.libs.Movies.search({title: title, year: year, id: id})
            .then((movies)=>{
                    if(movies == []) {
                        main.libs.Movies.omdb(title)
                        .then((movie)=>{
                            res.json(movie);
                        });
                    } else {
                        res.json(movies);
                    }
                })
            .catch(next);
        },

        'save': (req, res, next)=>{
            debug(".save called");

            var title  = req.swagger.params.movie.value.name ? req.swagger.params.movie.value.name : null;
            var year  = req.swagger.params.movie.value.image ? req.swagger.params.movie.value.image : null;

            main.libs.Movies.save({title: title, year: year})
            .then((movies)=>{
                    res.json(movies);
                })
            .catch(next);
        }

    };//end return
}

module.exports = Movies;