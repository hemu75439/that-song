const router = require('express').Router()
const pool = require('../dbconnect')


router.get('/', (req, res)=> {

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
        connection.query("select * from playlists order by rand() limit 1;", (error, playlist)=> {
        
            connection.query("select * from songs order by rand() limit 2;", (error, songs)=> {
                
                res.render('homepage', {
                    title: 'Homepage',
                    playlist: playlist,
                    songs: songs
                })

            });

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




router.get('/find', (req, res)=> {
    res.render('find', {
        title: 'Find'
    })
})





module.exports = router