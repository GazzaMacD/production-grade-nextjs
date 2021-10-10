import type { NextApiRequest, NextApiResponse } from 'next'

export default function preview(req: NextApiRequest, res: NextApiResponse): void {
  res.setPreviewData({})
  const route = Array.isArray(req.query.route) ? req.query.route[0] : req.query.route
  if (!route) {
    res.end('Please set route query param')
  } else {
    res.redirect(route)
  }
}
