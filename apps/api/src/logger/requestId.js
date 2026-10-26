export function requestIdHeader(req, res, next) {
  if (req.id) res.setHeader('x-request-id', req.id)
  next()
}
