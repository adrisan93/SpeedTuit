var contextsList = ["selection","link","image","page"];

for(i=0; i<contextsList.length; i++) {
  var context = contextsList[i];
  var titleX = "Tuiter con SpeedTuit este "+context+" en tu perfil de Twitter";
  
  chrome.contextMenus.create({
    title:titleX,
    contexts:[context],
    onclick: clicHandler,
    id: context
  });
}




//selection, link, image, page

function clicHandler(selectedText, tab) {
  //alert(selectedText.selectionText);
  switch(selectedText.menuItemId) {
    case "selection":
      chrome.windows.create({url: "https://twitter.com/intent/tweet?text="+encodeURIComponent(selectedText.selectionText),type:"panel" });
      break;
    case "link" :
      chrome.windows.create({url: "https://twitter.com/intent/tweet?url="+encodeURIComponent(selectedText.linkUrl),type:"panel"});
      break;
    case "image" :
      chrome.windows.create({url: "https://twitter.com/intent/tweet?url="+encodeURIComponent(selectedText.srcUrl),type:"panel"});
      break;
    case "page" :
      chrome.windows.create({url: "https://twitter.com/intent/tweet?text="+encodeURIComponent(tab.title)+"&url="+(selectedText.pageUrl),type:"panel"});
      break;
  }
  
}
