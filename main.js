var e;

document.addEventListener("mousedown", function(event){
    //right click    
    if(event.button == 2) { 
        e = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (e.nodeName === "DIV") {        
        e.innerHTML = getText(e.innerHTML, request.value, request.replaceAll);
    } else {        
        e.value = getText(e.value, request.value, request.replaceAll);
    }

    e.blur();
    e.focus();
    sendResponse({ success: true });
  });

function getText(original, value, replace) {    
    if (!replace) {
        var ss = e.selectionStart,
            se = e.selectionEnd;
        return original.substr(0, ss) + value + original.substr(se, (original.length - 1));
    } 
    return value;
}