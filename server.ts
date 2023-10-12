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
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      return new Response(Bun.file("./index.html"));
    } else if (url.pathname === "/api/get") {
      if (req.method !== "GET") {
        return new Response("", { status: 405 });
      }
      const user = url.searchParams.get("user");
      if (user) {
        const state = getState(db, user);
        return Response.json(state);
      } else {
        return new Response("No user", { status: 400 });
      }
    } else if (url.pathname === "/api/post") {
      if (req.method !== "POST") {
        return new Response("", { status: 405 });
      }
      const json = await req.json();
      const status = insertState(db, json);
      return new Response("", { status: status });
    } else if (url.pathname === "/api/login") {
      if (req.method !== "POST") {
        return new Response("", { status: 405 });
      }
      const json = await req.json();
      return Response.json({
        username: json.username,
        password: json.password,
      });
    } else if (url.pathname === "/api/logout") {
      if (req.method !== "POST") {
        return new Response("", { status: 405 });
      }
      return new Response("Logged out!");
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
