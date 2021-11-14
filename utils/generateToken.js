import jwt from 'jsonwebtoken';

const generateToken = (obj) => {
  return jwt.sign(obj, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
