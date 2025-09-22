let appPromise: Promise<any> | null = null;

async function getApp() {
  if (!appPromise) {
    appPromise = (async () => {
      // @ts-ignore - Dynamic import of built backend app
      const buildModule = await import("../backend/dist/app.js");
      // Handle both default export and named export scenarios
      const build = buildModule.default || buildModule;
      const app = await build();
      await app.ready();
      return app;
    })();
  }
  return appPromise;
}

module.exports = async function handler(req: any, res: any) {
  const app = await getApp();
  app.server.emit("request", req, res);
}
