var serverUrl = "https://appliouaibe-server.onrender.com";

function getMessages() {
  return fetch(serverUrl + '/msg/getAll')
    .then(function(response) {
      return response.json();
    });
}

function postMessage(message) {
  return fetch(serverUrl + '/msg/post/' + message);
}

function getAllMessagesAndUpdate() {
  return getMessages().then(function(messages) {
    var messagesFormatted = messages.map(function(message) {
      return { "msg": message };
    });
    update(messagesFormatted);
  });
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

function sendLocalImage() {
  let input = document.getElementById("image-input-2");
  let file = input.files[0];

  // Check if a file was selected
  if (file) {
    let reader = new FileReader();

    reader.onload = function(event) {
      let imageUrl = event.target.result;
      document.body.style.backgroundImage = `url('${imageUrl}')`;
    };

    reader.readAsDataURL(file);
  }
}

function sendImage() {
  let input = document.getElementById("image-input-1");
  let file = input.files[0];
  let formData = new FormData();
  formData.append("image", file);

  fetch(serverUrl + '/image/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      let imageUrl = JSON.parse(data).imageUrl;
      console.log(imageUrl);
      displayImage(imageUrl);
    })
    .catch(error => {
      console.error('Error uploading image:', error);
    });
}


function displayImage(imageUrl) {
  let container = document.getElementById("image-container");
  container.innerHTML = "";

  let img = document.createElement("img");
  img.src = imageUrl;
  img.alt = "Uploaded image";
  container.appendChild(img);
}



function new_message() {
  let textarea = document.getElementById("send-msg-textarea");

  // Push message to server
  postMessage(textarea.value).then(getAllMessagesAndUpdate);

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
