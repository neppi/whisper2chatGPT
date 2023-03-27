import esbuild from "esbuild";
esbuild.buildSync({
  nodePaths: ["./node_modules"],
  platform: "node",
  entryPoints: ["service.ts"],
  bundle: true,
  external: ["fsevents", "net"],
  outfile: ".build/service.js",
});
