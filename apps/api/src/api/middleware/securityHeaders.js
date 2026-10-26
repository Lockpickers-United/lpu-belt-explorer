import helmet from 'helmet'

const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            styleSrc: ["'self'"],
            fontSrc: ["'self'"]
        }
    }
})

export default function securityHeaders(req, res, next) {
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    helmetMiddleware(req, res, next)
}
