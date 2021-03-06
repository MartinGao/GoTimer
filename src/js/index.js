var timers = Array.apply(null, Array(5));

function startTimer(element) {

  var str =  '';
  var color = '#5cb85c';
  var btn = '';

  if (element.innerText.match(/Start/)) {
    str = "Would you like to start this timer?";
    color = '#5cb85c';
    btn = "Yes, Start it!";
  }
  else{
    str = "Would you like to stop this timer?";
    color = '#eea236';
    btn = "Yes, Stop it!";
  }
  swal({
    title: str,
    text: "",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: color,
    confirmButtonText: btn,
    cancelButtonText: "Nope!",
    closeOnConfirm: false,
    closeOnCancel: false
  }, function(isConfirm){
    if (isConfirm) {

      if (element.innerText.match(/Start/)) {
        swal.close()
        notie.alert(1, 'Timer Started!', 1.5);
        element.innerHTML = "<span class='glyphicon glyphicon-stop' aria-hidden='true'></span> Stop";
      } else {
        swal.close()
        notie.alert(2, 'Timer Stopped!', 1.5);
        var buttonIndex = jQuery(element).index('.timer-button');
        clearTimeout(timers[buttonIndex]);
        element.innerHTML = "<span class='glyphicon glyphicon-play' aria-hidden='true'></span> Start";
        return;
      }

      var timerElement = jQuery(element).prev('.timer')[0];
      timerElement.innerHTML = '00:00:00';
      var timerIndex = jQuery(timerElement).index('.timer');

      countUp({start: new Date(), element: timerElement, timerIndex: timerIndex});



    } else {
      swal.close()
    }
  });
}

function countUp(timer) {

  var diff = new Date() - timer.start;
  var hours = Math.floor(diff / (60*60*1000));
  var mins = Math.floor(diff % (60*60*1000) / (60*1000));
  var secs = Math.floor(diff % (60*60*1000) % (60*1000) / 1000);

  timer.element.innerHTML = ('0'+hours).slice(-2) + ':' + ('0'+mins).slice(-2) + ':' + ('0'+secs).slice(-2);

  timers[timer.timerIndex] = setTimeout(function() { countUp(timer); }, 1000);
}
