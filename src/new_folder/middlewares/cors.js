function corsMiddleware(req, res, next) {
    
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS');

 
  res.setHeader('Access-Control-Allow-Headers',
    'Content-Type, Authorization');

  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next(); // requisições normais continuam
}

module.exports = corsMiddleware;