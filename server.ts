import Bun from "bun";
import { getState, initDb, insertState } from "./src/db";

const bundle = async () => {
  await Bun.build({
    entrypoints: ["./index.ts"],
    outdir: "./build/",
    naming: "[dir]/bundle.js",
    // sourcemap: "inline",
    // minify: true,
  });
};

const db = initDb();

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      return new Response(Bun.file("./index.html"));
    } else if (url.pathname === "/api/get") {
      const state = getState(db);
      return Response.json(state);
    } else if (url.pathname === "/api/post") {
      const state = JSON.stringify({ text: "hello" });
      const status = insertState(db, state);
      return new Response(status);
    } else if (url.pathname === "/styles.css") {
      return new Response(Bun.file("./styles.css"));
    } else if (url.pathname.startsWith("/components/")) {
      const componentName = url.pathname.replace("/components/", "");
      if (componentName) {
        const component = Bun.file(`./components/${componentName}`);
        return new Response(component);
      }
    } else if (url.pathname === "/build/bundle.js") {
      return new Response(Bun.file("./build/bundle.js"));
    } else {
      return new Response("404");
    }
  },
  websocket: null,
});

bundle();
console.log(`Listening on localhost:${server.port}`);
