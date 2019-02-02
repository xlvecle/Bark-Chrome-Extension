var data = {
  serverURLs: []
}
var data = {}
var dataServerURLs = []
Object.defineProperty(data, 'serverURLs', {
    configurable: true,
    get: function() {
      return dataServerURLs;
    },
    set: function(value) {
      dataServerURLs = value;
      var str = '<ul>';
      value.forEach(function(it) {
        str += '<li class="url"><strong>'+ it + '</strong> <button>delete</button></li>';
      }); 

      str += '</ul>';
      document.getElementById('urls').innerHTML = str;
      //set delete button 
      $("ul").on("click", "button", delete_server);

      //save to chrome.storage
      chrome.storage.sync.set({
        server_urls: this.serverURLs,
      }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
          status.textContent = '';
        }, 750);
      });

    }
})

function ValidURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    alert("Please enter valid URL.");
    return false;
  } else {
    return true;
  }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    server_urls: [],
    likesColor: true
  }, function(items) {
    data.serverURLs = items.server_urls;
    // document.getElementById('server_url').value = items.server_urls;
  });
}

//delete server urls
function delete_server(e) {
  e.preventDefault();
  dataServerURLs.splice($(this).parent().index(), 1);
  data.serverURLs = dataServerURLs;
  $(this).parent().remove();
}

// Saves options to chrome.storage
function addServer() {
  var server_url = document.getElementById('server_url').value;

  if (ValidURL(server_url)) { //check url if valid 

    //Check server if valid
    var server_origin = server_url.substr(0, server_url.lastIndexOf("/", server_url.lastIndexOf("/") - 1));
    httpGetAsync(server_origin + "/ping", function (httpData) {
      if (httpData == 'error') {
        alert('Invalid Server URL!')
      } else {
        httpData = JSON.parse(httpData);
        console.log(httpData);
        if (httpData.code === 200 && httpData.message === 'pong') {
          console.log('Valid Server');
          data.serverURLs.push(server_url);
          //TODO ugly listen the push array change 
          data.serverURLs = data.serverURLs
        } else {
          alert("Invalid Server URL!" + data.message);
        }
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('add').addEventListener('click',
    addServer);

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

