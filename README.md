# Anywhere JS

This JavaScript client lib enables rendering any Markdown page hosted on Github inside of your HTML content.

## Quickstart

Add this before your closing `</head>`:

        <script src="https://cdn.rawgit.com/chjj/marked/master/marked.min.js"></script>
        <script src="https://cdn.rawgit.com/vinyll/anywhere/master/dist/anywhere.js"></script>
        <script>
            Anywhere = {
              user: "vinyll",
              repo: "anywhere",
              branch: "master"
            }
        </script>

Now use it adding the `data-anywhere` attribute telling the file to read from:

    <p data-anywhere="demo-slot">default content</p>

This will retrieve the _demo-slot.md_ file from the Github repo.

## Configuration

For a github user _vinyll_, pointing to a _anywhere_ repo on the branch _master_, here's a sample config:

    <script>
        Anywhere = {
          user: "vinyll",
          repo: "anywhere",
          branch: "master"
        }
    </script>

Now if you widh to get the content from the _my-content.md_ file, just add a `data-anywhere="my-content"` attribute to some tag in your HTML.
You only need to mention the filename, not the filetype which will be appened (_.md_ extension).

The example below will therefore get the markdown content from _https:github.com/vinyll/anywhere/my-content.md_, convert it into HTML and render it into.

## Usage

With this lib you can use Github as a content editor with git powers and Github benefits.
