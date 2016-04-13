var fs = require('fs');
var mm = require('musicmetadata');
var allsongs = require('../../allsongs2.json');

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return this.charAt(0) + parseInt(Math.abs(hash));
};


//rename
// fs.readdir('/home/anne/risejs/public/audios', function(err, data) {
//     console.log(data);

//     for (var i=0; i<data.length; i++) {
//         var title = data[i].substring(15,data[i].length-4);
//         console.log(title);
//         fs.rename('/home/anne/risejs/public/audios/'+data[i], '/home/anne/risejs/public/audios/ra'+title.hashCode()+'.mp3', function(err) {
//             if ( err ) console.log('ERROR: ' + err);
//         }); 
//     }

// })

//get metadata
var songslist = allsongs.songs;
var newsongslist = [];
var c = songslist.length;

for (var i=0; i<songslist.length; i++) {
  var song = songslist[i];
  var title = song.title;

  (function(s) {
    var parser = mm(fs.createReadStream('audiocopy/Rise Against - '+s.title+'.mp3'), { duration: true }, function (err, metadata) {
      if (err) throw err;

      console.log(s.title);
      s.album = metadata.album;
      s.duration = metadata.duration;
      newsongslist.push(s);

      taskComplete();
    });
  })(song);



}

function taskComplete()
{
    c--;

    if ( c <= 0 ) {
        // this gets get called after each task reported to be complete
        console.log(newsongslist);
        allsongs.songs = newsongslist;
        fs.writeFile('allsongsnew.json', JSON.stringify(allsongs));
    }
}

