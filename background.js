var contextsList = ["selection","link","image","page"];

for(i=0; i<contextsList.length; i++) {
  var context = contextsList[i];
  var titleX = "Tuitear con SpeedTuit este "+context+" en tu perfil de Twitter";
  
  chrome.contextMenus.create({
    title:titleX,
    contexts:[context],
    onclick: clicHandler,
    id: context
  });
}


function clicHandler(selectedText, tab) {
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

//Notificacion
var messages = [];
var ids = [];
var latestID;

$(function(){
  engine();
  setInterval(engine, 5000);
});

function engine() {
  var newTweets = [];
  $.get('https://twitter.com/i/notifications',function(data) {
    var htmlData = data;
    $data = $(htmlData).find('#stream-items-id').eq(0);
    $data.find('.activity-truncated-tweet').remove();
    $data.find('.activity-supplement').remove();
    $('body').append($data);
    for(i = 0; i < $data.find('li.stream-item').length;i++) {
      ids[i] = $data.find('li.stream-item').eq(i).attr('data-item-id');
      messages[i] = $data.find('li.stream-item').eq(i).attr('data-component-context');
      switch(messages[i]) {
      	case 'reply_activity':
      		messages[i] = "Han respondido a uno de tus tweets";
      		break;
        case 'favorited_retweet_activity':
        	messages[i] = "Han indicado que le gustan tus Retweets";
        	break;
        case 'retweet_activity':
        	messages[i] = "Han retwitteado uno de tus Tweet";
        	break;
        case 'favorite_activity':
        	messages[i] = "Han indicado que le gusta tu Tweet";
        	break;
        case 'mention_activity':
        	messages[i] = "Has sido mencionado en un Tweet";
        	break;
        case 'retweeted_retweet_activity' :
        	messages[i] = "Han retwitteado tu Retweet";
        	break;
        case 'follow_activity':
        	messages[i] = "Tienes un nuevo seguidor en Twitter!";
        	break;
        case 'favorited_mention_activity':
        	messages[i] = "indicaron que le gusta una respuesta dirigida a ti";
        	break;
        case 'retweeted_mention_activity':
        	messages[i] = "Han retwitteado una respuesta dirigida a ti";
        	break;
        default:
        	messages[i] = "";
      }
    }
    console.log(messages);

    if(latestID == ids[0]) {

    } else if(latestID === undefined) {
        var options = {
          type: "basic",
          title: "TuitNotification",
          message : "Notificaciones de tu cuenta de Twitter",
          iconUrl: "icon.png"
        }
        chrome.notifications.create(options);
        latestID = ids[0];
    }else if(latestID != ids[0]) {
      for(j = 0; j < ids.length; j++) {
          if(latestID == ids[j]) {
            break;
          } else {
            if(messages[j] != "") {
              newTweets[j] = messages[j];
            } 
          }  
      }
          latestID = ids[0];
    }
   
    if(newTweets.length == 0) {

    }else {
      for(i = 0; i < newTweets.length; i++) {
        var myTweet = {
          type: "basic",
          title: "Tienes una nueva notificacion en Twitter",
          message : newTweets[i],
          contextMessage: "TuitNotification",
          buttons: [{
            title: "Ver notificiaciones"
          }],
          iconUrl: "icon.png"
        };
        chrome.notifications.onButtonClicked.addListener(function() {
          window.open('https://twitter.com/i/notifications');
        });
        chrome.notifications.create(myTweet); 
      }
    }
    console.log(latestID);
    console.log(newTweets);
  });
}