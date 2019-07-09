var socket = io();
socket.on('audioMessage', function (audioChunks) {
    const audioBlob = new Blob(audioChunks);
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
});

socket.on('user', function (usercount) {
    $('.usercount').text(usercount)
});

socket.on('playStarSound', () => {
    var sound = document.getElementById("audio");
    sound.play();
})


navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        var audioChunks = [];
        $('.play-button').on('mousedown touchstart ', function (e) {
                mediaRecorder.start();
                socket.emit('recordStarted');
                $(this).toggleClass("paused");
        }).bind('mouseup mouseleave touchend', function (e) {
            if (mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                $(this).toggleClass("paused");
            }
        });
        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);

        });
        mediaRecorder.addEventListener("stop", () => {
            //socket.broadcast.emit('audioMessage', audioChunks);
            socket.emit('audioMessage', audioChunks);
            audioChunks = [];
        });
    });