import jwt from 'jsonwebtoken';

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.json({
          isLoggedIn: false,
          message: 'Failed to Authenticate',
        });
      req.user = { ...decoded };
      next();
    });
  } else {
    res.json({ message: 'Incorrect Token Given', isLoggedIn: false });
  }
};

export default verifyJWT;
