Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

chrome.storage.sync.get( {
  tabData: [],
}, function (data) {
  fullHTML = "";
  console.log(data);

  for (var i = data.tabData.length-1; i>= 0; i--) {
    // console.log(data.tabData[i]);
    var str = `<div><hr><ul><span>SavedTime: ${data.tabData[i][0].date}</span><button class="restore" id="restore_${i}">restore</button>
    <button class="delete" id="delete_${i}" value="${i}">delete</button>`
    data.tabData[i].forEach(function(it) {
      str += `<li class="url"><div><a href="${it.url}" target="_blank">${it.title}</a></li>`;
    }); 

    str += '</ul></div>';

    fullHTML += str;
  }
  document.getElementById('urls').innerHTML = fullHTML;
  //set restore button 
  var restoreButtons = document.getElementsByClassName("restore");
  for (var i=0; i < restoreButtons.length; i++) {
      restoreButtons[i].onclick = function (e) {
        var links = Array.from(this.parentNode.children).filter(el=> el.tagName == "LI");
        links.forEach(it=>
          chrome.tabs.create({url: it.firstChild.firstChild.href})
        )
      }
  };


  //set restore button 
  var deleteButtons = document.getElementsByClassName("delete");
  for (var i=0; i < deleteButtons.length; i++) {
      deleteButtons[i].onclick = function (e) {
        console.log(this.value);
        data.tabData.remove(this.value);
        this.parentNode.parentNode.remove();
        //save to chrome.storage
        chrome.storage.sync.set({
          tabData: data.tabData,
        });  
      }
  };

});      