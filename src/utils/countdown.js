export const countdown = (endDate, updateState, pause = false) => {
  let days, hours, minutes, seconds, milliseconds;
  
  endDate = new Date(endDate).getTime();
  
  if (isNaN(endDate)) {
	  return;
  }
  
  setInterval(calculate, 400);
  
  function calculate() {
    let startDate = new Date();
    startDate = startDate.getTime();
    
    let timeRemaining = parseInt((endDate - startDate) / 1000);
    
    if (timeRemaining >= 0) {
      days = parseInt(timeRemaining / 86400);
      timeRemaining = (timeRemaining % 86400);
      
      hours = parseInt(timeRemaining / 3600);
      timeRemaining = (timeRemaining % 3600);
      
      minutes = parseInt(timeRemaining / 60);
      timeRemaining = (timeRemaining % 60);
      
      seconds = parseInt(timeRemaining);
      updateState(seconds)
    } else {
      return;
    }
  }
}