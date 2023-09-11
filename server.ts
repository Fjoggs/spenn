const bundle = async () => {
  await Bun.build({
    entrypoints: ["./index.ts"],
    outdir: "./build/",
    naming: "[dir]/bundle.js",
    // sourcemap: "inline",
    // minify: true,
  });
};

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      return new Response(Bun.file("./index.html"));
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
});

const respondWithHtml = {
  headers: {
    "Content-Type": "text/html",
  },
};

bundle();
console.log(`Listening on localhost:${server.port}`);
