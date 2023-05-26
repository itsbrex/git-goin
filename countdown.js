// var countdown = document.getElementById('countdown');
// var timeLeft = 3;

// var timer = setInterval(function () {
//  if (timeLeft > 0) {
//    countdown.innerHTML = "<span class='pulse'>" + timeLeft + '</span>';
//    timeLeft--;
//  } else {
//    clearInterval(timer);
//    countdown.innerHTML = "<span class='pulse'>Closing...</span>";
//    setTimeout(function () {
//      window.close();
//    }, 1000);
//  }
// }, 1000);

var countdown = document.getElementById('countdown');
var timeLeft = 3;

function renderCountdown() {
	countdown.innerHTML = "<span class='countdown-number'>" + timeLeft + '</span>';
	timeLeft--;
}

var timer = setInterval(function () {
	if (timeLeft >= 0) {
		renderCountdown();
		countdown.querySelector('.countdown-number').classList.add('pulse');
		setTimeout(function () {
			countdown.querySelector('.countdown-number').classList.remove('pulse');
		}, 200);
	} else {
		clearInterval(timer);
		countdown.innerHTML = "<span class='countdown-number'>Closing...</span>";
		countdown.querySelector('.countdown-number').classList.add('pulse');
		setTimeout(function () {
			window.close();
		}, 1000);
	}
}, 1000);
