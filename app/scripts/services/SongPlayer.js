(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        
        var currentAlbum = Fixtures.getAlbum();
        /**
        * @desc Buzz Object audio file
        * @type [Object]
        */
        var currentBuzzObject = null; 
        
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */ 
        var setSong = function(song) {        
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }
 
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
 
        songPlayer.currentSong = song;
    };
        
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        };
        
        var getSongIndex = function(song){
            return currentAlbum.songs.indexOf(song);
        };
        /**
        * @desc finds the song index within the album
        * @type function
        */
        SongPlayer.currentSong = null;
        
        SongPlayer.play = function(song) {     
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song){
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song){
                if (currentBuzzObject.isPaused()){
                    playSong(song);
                }
            }
        };
        
        SongPlayer.pause = function(song){     
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
         
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
            /**
            * @desc if the song is the first song in the index, the previous button will force the playing to stop
            * @type if statement
            */
        };
        /**
        * @desc finds the current song index and sends it back to the last
        * @type function
        */
        
        return SongPlayer;
    }
 
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();