
function linkIt(song) {
    let title = song.childNodes[1].childNodes[1].innerText
    let artist = song.childNodes[1].childNodes[3].innerText

    window.open('https://www.youtube.com/results?search_query='+ title + '-' + artist, '_blank')
}