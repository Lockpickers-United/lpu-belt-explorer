export default function lazyMount(app, basePath, loader) {
    let cached

    const mountPaths = [basePath]
    if (typeof basePath === 'string' && basePath.startsWith('/') && !basePath.startsWith('//')) {
        mountPaths.push(`/${basePath}`)
    }

    app.use(mountPaths, async (req, res, next) => {
        try {
            if (!cached) {
                const mod = await loader()
                cached = mod.default // an Express Router
            }
            return cached(req, res, next)
        } catch (e) { next(e) }
    })
}
