import * as authService from "../services/authService.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const user = await authService.registerUser({ name, email, password, role });
    return res.status(201).json({ message: "User registered", user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const data = await authService.loginUser({ email, password });
    return res.status(200).json({ message: "Login successful", ...data });
  } catch (err) {
    next(err);
  }
};
