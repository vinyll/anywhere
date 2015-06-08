var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

Anywhere = {
  version: '0.3',
  config: { 'default': {} }
};

/**
* Add marked to included scripts.
*/
var script = document.createElement('script');
script.src = 'https://cdn.rawgit.com/chjj/marked/master/marked.min.js';
document.head.appendChild(script);

/**
* Anywhere local object reads its config from window.Anywhere.
*/

var DOMWrapper = (function () {
  function DOMWrapper(node) {
    _classCallCheck(this, DOMWrapper);

    this.node = node;
    this.node.anywhere = this;
  }

  _createClass(DOMWrapper, [{
    key: 'updateFromString',
    value: function updateFromString(string) {
      this.node.innerHTML = string;
      this.dispatchUpdate(string);
    }
  }, {
    key: 'updateFromMarkdown',
    value: function updateFromMarkdown(mark) {
      var html = marked(mark);
      // If the node is type 'inline', strip out the <p> tag from marked.
      if (this.getDisplayType() === 'inline') {
        inlineContent = html.match(/^<p>(.*)<\/p>\s*$/);
        if (inlineContent.length > 1) {
          html = inlineContent[1];
        }
      }
      return this.updateFromString(html);
    }
  }, {
    key: 'dispatchUpdate',
    value: function dispatchUpdate(info) {
      this.node.dispatchEvent(new CustomEvent('update', { 'detail': info }));
    }
  }, {
    key: 'getDisplayType',
    value: function getDisplayType() {
      return this.node.style.display || window.getComputedStyle(this.node).display;
    }
  }]);

  return DOMWrapper;
})();

/**
* Github content connector and content extractor.
*/

var GithubExtractor = (function () {
  function GithubExtractor(config) {
    _classCallCheck(this, GithubExtractor);

    if (!config) {
      throw new Error('You should declare a config object with \'user\' and\n        \'repo\' keys.');
    }
    this.config = config;
  }

  _createClass(GithubExtractor, [{
    key: 'getUrl',

    // Build the url based on the config.
    value: function getUrl(config) {
      var branch = config.branch || 'master';
      return 'https://rawgit.com/' + config.user + '/' + config.repo + '/' + branch + ('/' + config.filename + '.md');
    }
  }, {
    key: 'getContentFromFile',

    // Connect to rawgit.com, get the filename content and return it to
    // the callback.
    // `config` is an object with these keys: `user`, `branch`, `repo`,
    // `filename`.
    value: function getContentFromFile(callback) {
      var http = new XMLHttpRequest();
      var url = this.getUrl(this.config);
      http.open('GET', url, true);
      http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
          callback(http.responseText);
        } else if (http.status && http.status !== 200) {
          throw new Error('Could not parse \'' + url + '\'.\n          Please check your configuration.');
        }
      };
      http.send();
    }
  }]);

  return GithubExtractor;
})();

;

/**
* Wait for the DOM to be loaded, detect all 'data-anywhere' attributes and
* load their content.
* Also allow the `update()` method
*/
window.addEventListener('load', function (event) {
  var config = Anywhere.config['default'];
  [].forEach.call(document.querySelectorAll('[data-anywhere]'), function (node) {
    config.filename = node.attributes['data-anywhere'].value;
    var extractor = new GithubExtractor(config);
    var nodeObj = new DOMWrapper(node);
    // On DOM load, read the content.
    extractor.getContentFromFile(function (r) {
      nodeObj.updateFromMarkdown(r);
    });

    // When update() is invoqued on the node, update the content.
    node.update = function () {
      nodeObj.updateFromFile(extractor);
    };
  });
});
