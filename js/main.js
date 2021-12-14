/**functions */
function setLinkFromCookie() {
  if (document.cookie.split(';')[0] != undefined) {
    config.link_dataset = document.cookie.split(';')[0].split("=")[1];
    $("#link").val(config.link_dataset);
    createPlotFromJson(config.link_dataset);
  }
}

/*****onclick********/
function loadDataset(is_not_home){
  console.log($("#link").val().trim())
  config.link_dataset = $("#link").val().trim();
  document.cookie = "link=" + config.link_dataset;
  if(is_not_home){
    window.location.href="./pages/home.html";
  }
};

function dowload(){
  var myjson=JSON.stringify(data_matrix);
  var a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(myjson));
  a.setAttribute('download',  "filename.json");
  a.click()
}

/**on startup page */
setLinkFromCookie();