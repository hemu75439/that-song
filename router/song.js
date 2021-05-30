const router = require('express').Router()
const pool = require('../dbconnect')


router.get('/', (req, res)=> {
    res.render('song', {
        title: 'Search Results'
    })
})


router.get('/add', (req, res)=> {
    res.render('addsong', {
        title: 'Add New Song'
    })
})


router.get('/find', (req, res)=> {
    res.render('findsong', {
        title: 'Search Songs'
    })
})







router.post('/add', (req, res)=> {
    
    let record = [
        req.body.name,
        req.body.artist,
        req.body.genre,
        req.body.album,
        req.body.year
    ]

    pool.getConnection((err, connection)=> {

        if (err) {
            res.render('failure', {
                title: "Error",
                small: "SOMETHING WENT",
                big: "WRONG"
            })
            console.log(err);
        } // not connected!
      
        // Use the connection
        connection.query("insert into songs(name, artist, genre, album, year) values (?);", [record], (error, playlist)=> {
        
            res.render('success', {
                title: 'Success',
                small: "SONG ADDED",
                big: "SUCCESSFULLY"
            })

            // When done with the connection, release it.
            connection.release();
        

            // Handle error after the release.
            if (error) {
                console.log(err);
                res.render('failure', {
                    title: "Error",
                    small: "SOMETHING WENT",
                    big: "WRONG"
                })
            }
      

          // Don't use the connection here, it has been returned to the pool.
        });
    });
})






router.post('/find', (req, res)=> {

    let search = ""
    let sql
    
    let keys = Object.keys(req.body)
    let values = Object.values(req.body)
        
    for(let i=0; i < keys.length; i++) {
        if(values[i]) {
            if(search.length > 0) search += " and " + keys[i] + " = " + `"${values[i]}"`
            else search += keys[i] + " = " + `"${values[i]}"`
        }
    }
        
        if(search.length > 0) {
            sql = "select * from songs where " + search
            
            pool.getConnection((err, connection)=> {
    
                if (err) {
                    res.render('failure', {
                        title: "Error",
                        small: "SOMETHING WENT",
                        big: "WRONG"
                    })
                    console.log(err);
                } // not connected!
              
                // Use the connection
                connection.query(sql, (error, songs)=> {
                
                    if(songs.length != 0) {

                        res.render('searchresult', {
                            title: "Search Results",
                            playlists: false,
                            songs: songs
                        })

                    } else {

                        res.render('failure', {
                            title: "Not Found",
                            small: "NO SONGS OF THAT NAME",
                            big: "NOT FOUND"
                        })

                    }
        
                    // When done with the connection, release it.
                    connection.release();
                
        
                    // Handle error after the release.
                    if (error) {
                        console.log(err);
                        res.render('failure', {
                            title: "Error",
                            small: "SOMETHING WENT",
                            big: "WRONG"
                        })
                    }
              
        
                  // Don't use the connection here, it has been returned to the pool.
                });
            });
    
        } else {
            res.render('failure', {
                title: "Error",
                small: "ENTER SOME VALUES",
                big: "ALL FIELDS EMPTY"
            })
        }

})
    




router.get('/addtoplaylist/:id', (req, res)=> {

    let id = req.params.id

    pool.getConnection((err, connection)=> {
    
        if (err) {
            res.render('failure', {
                title: "Error",
                small: "SOMETHING WENT",
                big: "WRONG"
            })
            console.log(err);
        } // not connected!
      
        // Use the connection
        connection.query("select * from songs where song_id = (?)", id, (error, song)=> {

            connection.query("select playlist_id, name from playlists", (error, playlists)=> {
        
                if(playlists.length != 0) {

                    res.render('addtoplaylist', {
                        title: 'Add to Playlist',
                        song: song,
                        playlists: playlists
                    })

                } else {

                    res.render('failure', {
                        title: "Not Found",
                        small: "",
                        big: "THERE ARE NO PLAYLISTS"
                    })

                }

            })

            // When done with the connection, release it.
            connection.release();
        

            // Handle error after the release.
            if (error) {
                console.log(err);
                res.render('failure', {
                    title: "Error",
                    small: "SOMETHING WENT",
                    big: "WRONG"
                })
            }
      

          // Don't use the connection here, it has been returned to the pool.
        });
    });

})




router.post('/addtoplaylist/:id', (req, res)=> {

    let playlist_id = req.body.playlist_id
    let song_id = req.params.id


    pool.getConnection((err, connection)=> {
    
        if (err) {
            res.render('failure', {
                title: "Error",
                small: "SOMETHING WENT",
                big: "WRONG"
            })
            console.log(err);
        } // not connected!
      
        // Use the connection
        connection.query(`select * from playlist_songs where playlist_id = ${playlist_id} and song_id = ${song_id}`, (error, result)=> {

            if(result.length == 0) {

                //Insert record
                connection.query(`insert into playlist_songs(playlist_id, song_id) values (${playlist_id} , ${song_id});`, (error, result)=> {

                    if(error) {
                        console.log(error)
                        res.render('failure', {
                            title: "Error",
                            small: "SOMETHING WENT",
                            big: "WRONG"
                        })
                    }

                    res.render('success', {
                        title: 'Added Successfully',
                        small: "SONG ADDED TO PLAYLIST",
                        big: "SUCCESSFULLY"
                    })

                })

            } else {

                res.render('failure', {
                    title: "File Already Exists",
                    small: "",
                    big: "SONG ALREADY IN THE PLAYLIST"
                })

            }


            // When done with the connection, release it.
            connection.release();
        

            // Handle error after the release.
            if (error) {
                console.log(err);
                res.render('failure', {
                    title: "Error",
                    small: "SOMETHING WENT",
                    big: "WRONG"
                })
            }
      

          // Don't use the connection here, it has been returned to the pool.
        });
    });


})


module.exports = router