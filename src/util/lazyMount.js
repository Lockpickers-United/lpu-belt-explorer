export default function lazyMount(app, basePath, loader) {
    let cached
    app.use(basePath, async (req, res, next) => {
        try {
            if (!cached) {
                const mod = await loader()
                cached = mod.default // an Express Router
            }
            return cached(req, res, next)
        } catch (e) { next(e) }
    })
}
