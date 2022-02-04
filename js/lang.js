var languages;
var lang = "en";

$.ajax({
    url: '../languages.json',
    async: false,
    dataType: 'json',
    success: function (response) {
      languages = response
    }
});

$(document).ready(function() {
    setLanguage()
});

function setLanguage(langCode= 'en'){
    lang = langCode;
    $(".lang").each(function(index, element) {
      console.log($(this).attr("key"));
        $(this).text(translate($(this).attr("key"), languages, lang));
    });
}

function translate(key,json,lang) {
      var keys, value, _i, _len;
      keys = key.split(/\./);
      value = json[lang];
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        value = value != null ? value[key] : null;
      }
    return value;
}


function anomalyTextInfoTranslated (key, anomalyCode= -1){
    if(anomalyCode!= -1) {
        return translate(key, languages, lang)[anomalyCode-1];
    } else{
        return translate(key, languages, lang);
    }
}

function updateLanguageMenu(lang='en'){
    var icon ={'it':'italy','en':'united-kingdom'};
    $("#langDropdown").html(
      `<a class="dropdown-item d-flex align-items-center" href="#">
        <img class="icon rounded-circle" src="../images/icons/${icon[lang]}.png"></img>
        <span class="menu-title lang" key="LANGUAGES.${lang.toUpperCase()}"></span>
      </a>`
    );
    setLanguage(lang);
  }
