const router = require('express').Router()
const pool = require('../dbconnect')





router.get('/create', (req, res)=> {
    res.render('createplaylist', {
        title: 'Create Playlist'
    })
})


router.get('/find', (req, res)=> {
    res.render('findplaylist', {
        title: 'Search Playlist'
    })
})



router.post('/create', (req, res)=> {

    let record = [
        req.body.name,
        req.body.genre,
        new Date()
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
        connection.query("insert into playlists(name, genre, created) values (?);", [record], (error, playlist)=> {
        
            res.render('success', {
                title: 'Success',
                small: "PLAYLIST CREATED",
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
        sql = "select * from playlists where " + search
        
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
            connection.query(sql, (error, playlists)=> {
                
                if(playlists.length != 0) {

                    res.render('searchresult', {
                        title: "Search Results",
                        playlists: playlists,
                        songs: false
                    })

                }   else {

                    res.render('failure', {
                        title: "Not Found",
                        small: "NO PLAYLIST WITH THAT NAME",
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




router.get('/deletefromplaylist/:playlist_id/:song_id', (req, res)=> {
    
    let playlist_id = req.params.playlist_id
    let song_id = req.params.song_id


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
        connection.query(`delete from playlist_songs where playlist_id = ${playlist_id} and song_id = ${song_id};`, (error, playlist)=> {
        
            res.redirect(`/playlist/${playlist_id}`)

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





router.get('/:id', (req, res)=> {
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
        connection.query("select * from playlists where playlist_id = (?)", id, (error, playlist)=> {

            connection.query("select * from playlist_songs natural join songs where playlist_id = (?);", id, (error, songs)=> {

                res.render('playlist', {
                    title: "Playlist",
                    playlist: playlist,
                    songs: songs
                })

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




module.exports = router