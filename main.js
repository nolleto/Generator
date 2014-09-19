var e;

document.addEventListener("mousedown", function(event){
    //right click    
    if(event.button == 2) { 
        e = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    e.value = request.value;
    e.blur();
    e.focus();
    
  	sendResponse({ success: true });
  });