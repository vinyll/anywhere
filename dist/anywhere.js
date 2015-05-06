(function() {
  "use strict";

  /**
  * Add marked to included scripts.
  */
  var script = document.createElement('script');
  script.src = 'https://cdn.rawgit.com/chjj/marked/master/marked.min.js';
  document.head.appendChild(script);

  /**
  * Anywhere local object reads its config from window.Anywhere.
  */
  var Anywhere = {
    // Storing configuration
    _config: null,

    // Retrieve the config (user, repo, branch).
    getConfig: function() {
      if(!this._config) {
        this._config = window.Anywhere;
      }
      return this._config;
    },

    // Update a DOM node content reading from Github and injecting the text
    // into the innerHTML.
    // Strip the <p> if the node is an 'inline' style.
    updateNode: function(node) {

      var config = Anywhere.getConfig();
      config['filename'] = node.attributes['data-anywhere'].value;

      GithubExtractor.getContentFromFile(config, function(response) {
        var nodeDisplay = node.style.display
                        || window.getComputedStyle(node).display;
        var markedContent = marked(response);

        // If the node is type 'inline', strip out the <p> tag from marked.
        if(nodeDisplay === 'inline') {
          inlineContent = markedContent.match(/^<p>(.*)<\/p>\s*$/);
          if(inlineContent.length > 1) {
            markedContent = inlineContent[1];
          }
        }

        node.innerHTML = markedContent;
        node.dispatchEvent(new CustomEvent('update', {'detail': markedContent}));
      });
    }
  }

  /**
  * Github content connector and content extractor.
  */
  var GithubExtractor = {
    // Connect to rawgit.com, get the filename content and return it to
    // the callback.
    // `config` is an object with these keys: `user`, `branch`, `repo`,
    // `filename`.
    getContentFromFile: function(config, callback) {
      if(!config) {
        throw new Error("You should declare an 'Anywhere' object with " +
                        "'user', 'repo' and 'branch' keys.");
      }
      var url = "https://rawgit.com/{user}/{repo}/{branch}/{filename}.md"
                .replace('{user}', config.user)
                .replace('{repo}', config.repo)
                .replace('{branch}', config.branch || 'master')
                .replace('{filename}', config.filename);

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

  /**
  * Wait for the DOM to be loaded, detect all 'data-anywhere' attributes and
  * load their content.
  * Also allow the `update()` method
  */
  window.addEventListener('load', function(event) {

    [].forEach.call(document.querySelectorAll('[data-anywhere]'), function(node) {
      Anywhere.updateNode(node);
      node.update = function() {
        Anywhere.updateNode(this);
      };
    });
  });

})();

