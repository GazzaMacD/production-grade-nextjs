import type { NextApiRequest, NextApiResponse } from 'next';

export default function clearPreview(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  res.clearPreviewData();
  const route = Array.isArray(req.query.route)
    ? req.query.route[0]
    : req.query.route;
  res.redirect(route);
}
