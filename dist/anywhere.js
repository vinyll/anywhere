(function() {
  "use strict";

  var GithubExtractor = {
    /**
    Connect to rawgit.com, get the filename content and return it to
    the callback.
    */
    getContentFromFile: function(filename, callback) {
      var config = Anywhere;
      if(!config) {
        throw new Error("You should declare an 'Anywhere' object with " +
                        "'user', 'repo' and 'branch' keys.");
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
        } else if(http.status !== 200) {
          throw new Error("'Anywhere' could not parse '{url}'." +
                          "Please check your 'Anywhere' configuration."
                          .replace('{url}', url));
        }
      }
      http.send();
    }
  };

  window.addEventListener('load', function(event) {
    var name = "", markedContent = "", nodeDisplay = "", inlineContent = "";

    [].forEach.call(document.querySelectorAll('[data-anywhere]'), function(node) {
      name = node.attributes['data-anywhere'].value;

      GithubExtractor.getContentFromFile(name, function(response) {
        nodeDisplay = node.style.display
                    || window.getComputedStyle(node).display;
        markedContent = marked(response);

        // If the node is type 'inline', strip out the <p> tag from marked.
        if(nodeDisplay === 'inline') {
          inlineContent = markedContent.match(/^<p>(.*)<\/p>\s*$/);
          if(inlineContent.length > 1) {
            markedContent = inlineContent[1];
          }
        }

        node.innerHTML = markedContent;
      });
    });
  });

})();

