import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const root = resolve(".");
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);
    console.log(`[Request] ${pathname}`);
    
    let targetPath = pathname === "/" ? "index.html" : pathname;

    // Handle onboarding specific routing
    if (pathname.startsWith("/onboarding")) {
      // If it's just /onboarding or /onboarding/, serve the index.html
      if (pathname === "/onboarding" || pathname === "/onboarding/") {
        targetPath = "/onboarding/index.html";
      } else {
        // For assets, ensure they are looked up relative to the root or onboarding folder
        // The requester (iframe) might use ./assets/ which becomes /onboarding/assets/
        // Our folder is named 'onboarding' (the built dist)
        targetPath = pathname;
      }
    }

    const target = resolve(join(root, targetPath));
    console.log(`[Resolved] ${target}`);

    if (!target.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const data = await readFile(target);
    response.writeHead(200, { "Content-Type": contentTypes[extname(target)] || "application/octet-stream" });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`청년일자리도약장려금 관리 앱: http://localhost:${port}`);
});
