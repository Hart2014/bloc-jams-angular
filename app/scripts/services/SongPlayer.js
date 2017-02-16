(function() {
    function SongPlayer($rootScope, Fixtures) {
        
        var currentAlbum = Fixtures.getAlbum();
        var SongPlayer = {};

        /**
        * @desc Buzz Object audio file
        * @type [Object]
        */
        var currentBuzzObject = null; 
        
        /**
        * @desc finds the song index within the album
        * @type function
        */
        var getSongIndex = function(song){
            return currentAlbum.songs.indexOf(song);
        };
        /**
        * @desc finds the song index within the album
        * @type function
        */
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
            
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });
 
            SongPlayer.currentSong = song;
        };
        
        
        SongPlayer.currentSong = null; 
        SongPlayer.volume = null;
        
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;        
        
        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };      
        
        SongPlayer.volume = 80;
        
        SongPlayer.setVolume = function(volume){
            if (currentBuzzObject){
                currentBuzzObject.setVolume(volume);
            }
            SongPlayer.volume = volume;
        }

        
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        }
        
        var stopSong = function(song){
            currentBuzzObject.stop();
            song.playing = null;
        }

        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song){
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === null){
                song = currentAlbum.songs[0];
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
                stopSong(SongPlayer.currentSong);
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
        * @function next
        * @desc Set song to next song in album
        */
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;

            var lastSongIndex = currentAlbum.songs.length - 1;

            if (currentSongIndex > lastSongIndex) {
                stopSong(SongPlayer.currentSong);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };  

        return SongPlayer;
    }
 
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();