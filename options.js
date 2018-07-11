function ValidURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    alert("Please enter valid URL.");
    return false;
  } else {
    return true;
  }
}

// Saves options to chrome.storage
function save_options() {
  var server_url = document.getElementById('server_url').value;

  if (ValidURL(server_url)) { //check url if valid 

    //Check server if valid
    httpGetAsync(new URL(server_url).origin + "/ping", function (data) {
      if (data == 'error') {
        alert('Invalid Server URL!')
      } else {
        data = JSON.parse(data);
        console.log(data);
        if (data.code === 200 && data.message === 'pong') {
          console.log('Valid Server');

          //save to chrome.storage
          chrome.storage.sync.set({
            server_url: server_url,
          }, function() {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function() {
              status.textContent = '';
            }, 750);
          });
        }
      }
    })
  }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    server_url: '',
    likesColor: true
  }, function(items) {
    document.getElementById('server_url').value = items.server_url;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4) {
          if (xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
          } else {
            callback('error');
          }
        }
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
