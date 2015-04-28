# Anywhere JS

Makes your HTML content easily editable from Github in Markdown.

## How does it work?

1. Edit a file on your Github called _my-content.md_
2. Set the attribute `data-anywhere="my-content"` on a tag in your HTML page

Your tag content will be replaced with the one from _my-content.md_ and interpreted in HTML! Crazy huh!

[View demo](http://vinyll.github.io/anywhere/)


## Quickstart

Add this before your closing `</head>`:

        <script src="https://cdn.rawgit.com/vinyll/anywhere/master/dist/anywhere.js"></script>
        <script>Anywhere = {user: "vinyll", repo: "anywhere"};</script>

Now use it adding the `data-anywhere` attribute telling the file to read from:

    <p data-anywhere="README">default content</p>

This will retrieve the _README.md_ file from the Github repo and replace the <p> tag content.


## Configuration

For a github user _vinyll_, pointing to a _anywhere_ repo on the branch _master_, here's a sample config:

    <script>
        Anywhere = {
          user: "vinyll",  // your github username
          repo: "anywhere",  // your github repository
          branch: "master"  // the branch where the file is. Default is _master_
        }
    </script>

The example below will therefore get the markdown content from _https://github.com/vinyll/anywhere/blob/master/README.md_, convert it into HTML and render it into some tag.

See the [demo](http://vinyll.github.io/anywhere/) to see it in action or the [demo code](https://github.com/vinyll/anywhere/blob/gh-pages/index.html) to view how it works.


## Markdown conversion

'Anywhere' uses [marked](https://github.com/chjj/marked) to convert Github's Markdown to HTML.

> ### Inline / block types
> 
> Note that when you use `data-anywhere` attribute on a _inline_ tag (such as `<span>`, `<em>`) or if you forced that tag to `display: inline`, the Markdown content rendered will not have the `<p>` wrapper.
> Therefore the HTML will not break and you can css-style properly.


## Usage

With this lib you can use Github as a content editor with git powers and Github benefits.
You could also use it as your CMS.
Please let me know your usage.


## Contribute

Many ways to contribute:

- submit an issue when you find a bug
- suggest new ideas
- fork this repo and implement your features
- improve the code or demo
- find typos
- letting me know how you use it


## License

MIT. Refer to the _license.txt_ file.

