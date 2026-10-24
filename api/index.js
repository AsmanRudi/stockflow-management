
let appPromise;

export default async function handler(req, res) {
  try {
    if (!appPromise) {
      appPromise = import('../apps/api/src/app.js').then(
        (module) => module.default
      );
    }

    const app = await appPromise;
    return app(req, res);
  } catch (error) {
    console.error('[StockFlow API entry point]', error);

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memuat API server.'
    });
  }
}
