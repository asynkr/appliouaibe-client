const serverUrl = "https://de6323d2-a0a3-4e52-8d58-5b8197fcc3aa-00-27stsfo3uehei.worf.replit.dev";

function getMessages() {
  return fetch(serverUrl + '/msg/getAll')
    .then(function(response) {
      return response.json();
    })
}

function postMessage(message) {
  return fetch(serverUrl + '/msg/post/' + message)
}

function getAllMessagesAndUpdate() {
  getMessages().then(function(messages) {
    var messagesFormatted = messages.map(function(message) {
      return { "msg": message };
    });
    update(messagesFormatted);
  })
}

function update(tab/*: [{"msg": "..."}] */) {
  let msgsUl = document.getElementById("msg-list");
  let msgArray = msgsUl.getElementsByTagName("li");

  for (let i = msgArray.length - 1; i >= 0; i--) {
    msgArray[i].remove();
  }

  for (let i = 0; i < tab.length; i++) {
    const msgLi = document.createElement("li");
    const msgText = document.createTextNode(tab[i]["msg"]);
    msgLi.appendChild(msgText);
    msgsUl.appendChild(msgLi);
  }
}

function new_message() {
  let textarea = document.getElementById("send-msg-textarea");

  // Push message to server
  postMessage(textarea.value).then(getAllMessagesAndUpdate)

  // Remove text from textarea
  textarea.value = "";
}

getAllMessagesAndUpdate();