import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";
import Role from "../models/_helpers/role.js";

const secret = 'test';

/**
 * SIGNIN CONTROLLER
 */
export const signin = async (req, res) => {
  const { email, password } = req.body;

  // parameter validations
  if(!email && !password) return res.status(400).json({ message: "Email and Password is required!" });
  if(!email) return res.status(400).json({ message: "Email is required!" });
  if(!password) return res.status(400).json({ message: "Password is required!" });

  try {
    // check for user existance
    const oldUser = await UserModal.findOne({ email });
    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    // check for hashed password match
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    // response jwt token
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });
    res.status(200).json({ result: oldUser, token });

  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};

/**
 * SIGNUP CONTROLLER
 */
export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // parameter validations
  if(!email && !password) return res.status(400).json({ message: "Email and Password is required!" });
  if(!email) return res.status(400).json({ message: "Email is required!" });
  if(!password) return res.status(400).json({ message: "Password is required!" });

  try {
    // check for user existance
    const oldUser = await UserModal.findOne({ email });
    if (oldUser) return res.status(400).json({ message: "User already exists" });

    // generate hash for passsword
    const hashedPassword = await bcrypt.hash(password, 12);

    // create new user with hashed password 
    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`, role: Role.User });

    // response jwt token
    const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });
    res.status(201).json({ result, token });

  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
};
