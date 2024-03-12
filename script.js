var serverUrl = "https://appliouaibe-server.onrender.com";

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
  return getMessages().then(function(messages) {
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

function updateServerUrlDisplay(url) {
  let link = document.getElementById("server-url-current");
  link.innerText = url;
  link.href = url;
}

function updateCurrentServerUrl(url) {
  serverUrl = url.endsWith('/') ? url.substr(0, url.length - 1) : url;
}

function new_server_url() {

  const oldUrl = serverUrl;

  updateCurrentServerUrl(document.getElementById("server-url-input").value);
  updateServerUrlDisplay("Chargement...");

  getAllMessagesAndUpdate().then(function() {
    alert("Vous avez correctement changé d'URL");
    updateServerUrlDisplay(serverUrl);
  }).catch(function() {
    alert("Le changement d'URL a échoué");
    updateCurrentServerUrl(oldUrl);
    updateServerUrlDisplay(serverUrl);
  });
}

updateServerUrlDisplay(serverUrl);
getAllMessagesAndUpdate();
