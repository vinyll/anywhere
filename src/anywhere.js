Anywhere = {
  version: '0.3',
  config: {default: {}}
};

/**
* Add marked to included scripts.
*/
let script = document.createElement('script');
script.src = 'https://cdn.rawgit.com/chjj/marked/master/marked.min.js';
document.head.appendChild(script);

/**
* DOMWrapper is a wrapper for a DOM node to enpower its methods.
*/
class DOMWrapper {
  constructor(node) {
    this.node = node;
    this.node.anywhere = this;
  }

  updateFromString(string) {
    this.node.innerHTML = string;
    this.dispatchUpdate(string);
  }

  updateFromMarkdown(mark) {
    let html = marked(mark);
    // If the node is type 'inline', strip out the <p> tag from marked.
    if(this.getDisplayType() === 'inline') {
      inlineContent = html.match(/^<p>(.*)<\/p>\s*$/);
      if(inlineContent.length > 1) {
        html = inlineContent[1];
      }
    }
    return this.updateFromString(html);
  }

  dispatchUpdate(info) {
    this.node.dispatchEvent(new CustomEvent('update', {'detail': info}));
  }

  getDisplayType() {
    return this.node.style.display
           || window.getComputedStyle(this.node).display;
  }
}

/**
* Github content connector and content extractor.
*/
class GithubExtractor {
  constructor(config) {
    if(!config) {
      throw new Error(`You should declare a config object with 'user' and
        'repo' keys.`);
    }
    this.config = config;
  }

  // Build the url based on the config.
  getUrl(config) {
    let branch = config.branch || 'master';
    return `https://rawgit.com/${config.user}/${config.repo}/${branch}` +
           `/${config.filename}.md`;
  }

  // Connect to rawgit.com, get the filename content and return it to
  // the callback.
  // `config` is an object with these keys: `user`, `branch`, `repo`,
  // `filename`.
  getContentFromFile(callback) {
    let http = new XMLHttpRequest();
    let url = this.getUrl(this.config);
    http.open('GET', url, true);
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        callback(http.responseText);
      }
      else if(http.status && http.status !== 200) {
        throw new Error(`Could not parse '${url}'.
          Please check your configuration.`)
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
window.addEventListener('load', (event) => {
  var config = Anywhere.config.default;
  [].forEach.call(document.querySelectorAll('[data-anywhere]'), (node) => {
    config.filename = node.attributes['data-anywhere'].value;
    let extractor = new GithubExtractor(config);
    let nodeObj = new DOMWrapper(node);
    // On DOM load, read the content.
    extractor.getContentFromFile(r => {
      nodeObj.updateFromMarkdown(r);
    });

    // When update() is invoqued on the node, update the content.
    node.update = () => {
      extractor.config.filename = node.attributes['data-anywhere'].value;
      extractor.getContentFromFile(r => {
        nodeObj.updateFromMarkdown(r);
      });
    };
  });
});

