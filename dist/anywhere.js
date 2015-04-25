(function() {
  "use strict";

  var GithubExtractor = {
    getContentFromFile: function(filename, callback) {
      var config = Anywhere;
      if(!config) {
        throw new Error("You should declare an 'Anywhere' object with "
              + "'user', 'repo' and 'branch' keys.");
      }
      var url = "https://rawgit.com/{user}/{repo}/{branch}/{name}.md"
                .replace('{user}', config.user)
                .replace('{repo}', config.repo)
                .replace('{branch}', config.branch || 'master')
                .replace('{name}', filename);

      var http = new XMLHttpRequest();
      http.open("GET", url, true);
      http.onreadystatechange = function() {
        if (http.readyState === 4 && http.status === 200) {
          callback(http.responseText);
        }
      }
      http.send();
    }
  };

  window.addEventListener('load', function(event) {
    var name = "";
    [].forEach.call(document.querySelectorAll('[data-anywhere]'), function(node) {
      name = node.attributes['data-anywhere'].value;
      GithubExtractor.getContentFromFile(name, function(response) {
        node.innerHTML = marked(response);
      });
    });
  });

})();

