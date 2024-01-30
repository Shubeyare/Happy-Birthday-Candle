document.addEventListener("DOMContentLoaded", function () {

    // variable declarations
    var flame = document.getElementById('flame');
    var txt = document.querySelector('h1');




    // Function to handle microphone input
    function handleMicrophoneInput(event) {
        var volume = event.inputBuffer.getChannelData(0).reduce((a, b) => Math.abs(a) + Math.abs(b), 0);
        // Adjust the threshold as needed to detect stronger blows
        if (volume > 200.5) {
            flame.classList.remove('burn');
            flame.classList.add('puff');
            document.querySelectorAll('.smoke').forEach(function (smoke) {
                smoke.classList.add('puff-bubble');
            });
            var glow = document.getElementById('glow');
            if (glow) {
                glow.parentNode.removeChild(glow);
            }
            txt.style.display = 'none';
            txt.innerHTML = "Waxan kuu rajayn... <b>sanad</b> kale oo qurux badan";
            setTimeout(function () {
                txt.style.display = 'block';
            }, 750);
            var candle = document.getElementById('candle');
            if (candle) {
                candle.style.opacity = '0.5';
            }
        }
    }




    // Initialize microphone input
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            var audioContext = new AudioContext();
            var mediaStreamSource = audioContext.createMediaStreamSource(stream);
            var analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;
            mediaStreamSource.connect(analyser);
            var bufferLength = analyser.frequencyBinCount;
            var dataArray = new Float32Array(bufferLength);
            analyser.getFloatTimeDomainData(dataArray);
            setInterval(function () {
                analyser.getFloatTimeDomainData(dataArray);
                handleMicrophoneInput({ inputBuffer: { getChannelData: function () { return dataArray; } } });
            }, 100);
        })




        .catch(function (err) {
            // Error handling for microphone access denial or unavailability
            var errorMessage = "Error accessing microphone: ";
            if (err.name === 'NotAllowedError') {
                errorMessage += "Microphone access denied. Please grant microphone access to use this feature.";
            } else if (err.name === 'NotFoundError' || err.name === 'NotReadableError') {
                errorMessage += "Microphone not found or not available. Please ensure that a microphone is connected and try again.";
            } else {
                errorMessage += "An unexpected error occurred. Please try again later.";
            }
            console.error(errorMessage);
            // Display error message to the user
            alert(errorMessage);
        });




});
