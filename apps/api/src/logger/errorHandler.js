const truncate = (v, max = 2048) => {
  try {
    const s = typeof v === 'string' ? v : JSON.stringify(v)
    return s.length > max ? s.slice(0, max) + '…' : s
  } catch { return '[unserializable]' }
}

export function errorHandler(err, req, res, _next) {
  req.log.error({
    err,
    route: req.url,
    body: truncate(req.body),
    query: req.query,
    params: req.params
  }, 'unhandled error')

  res.status(500).json({ error: 'internal_error', requestId: req.id })
}
