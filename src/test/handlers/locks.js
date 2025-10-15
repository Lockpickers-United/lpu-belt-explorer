import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/locks', () => {
    return HttpResponse.json([{ id: '1', title: 'Quattro' }])
  })
]
