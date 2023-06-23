const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");
const app = express();
const timeAgo = require("node-time-ago");

app.use(morgan("dev"));

app.use(express.static("public"));

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    res.status(404);
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
          <header><img src="/logo.png"/>Wizard News</header>
  <div class="not-found">
   <p>404: Page not found</p>
    <img src="/dumbledore-frustrated.gif" />
  </div>
      </body>
    </html>`;
    res.send(html);
  } else {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div class="news-list">
          <header><img src="/logo.png"/>Wizard News</header>
          <div class='news-item'>
            <p>
              <span class="news-position">${post.id}. ▲</span>${post.title}
              <small>(by ${post.name})</small>
            </p>
            <small class="news-info">
              ${post.upvotes} upvotes | ${timeAgo(post.date)}
            </small>
          </div>
        </div>
      </body>
    </html>`);
  }
});

app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
        ${posts
          .map(
            (post) => `
          <div class='news-item'>
          
            <p>
              <span class="news-position">${post.id}. ▲</span><a href="/posts/${
              post.id
            }"> ${post.title}</a>
              <small>(by ${post.name})</small>
            </p>
            <small class="news-info">
              ${post.upvotes} upvotes | ${timeAgo(post.date)}
            </small>
          </div>`
          )
          .join("")}
      </div>
    </body>
  </html>
  `;
  res.send(html);
});

const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
