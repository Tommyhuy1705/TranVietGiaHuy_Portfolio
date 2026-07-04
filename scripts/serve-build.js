const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.join(__dirname, "..", "build");
const port = Number(process.env.PORT || 3000);

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
};

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(req.url.split("?")[0]);
  let file = path.join(root, pathname === "/" ? "index.html" : pathname);

  if (
    !file.startsWith(root) ||
    !fs.existsSync(file) ||
    !fs.statSync(file).isFile()
  ) {
    file = path.join(root, "index.html");
  }

  res.setHeader(
    "Content-Type",
    mime[path.extname(file)] || "application/octet-stream"
  );
  fs.createReadStream(file).pipe(res);
});

server.listen(port, () => {
  console.log(`Portfolio server running at http://localhost:${port}`);
});
