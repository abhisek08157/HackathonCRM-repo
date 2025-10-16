export const loginUser = async ({ email, password }) => {
 const user = await User.findOne({ email });
if (!user) {
  const err = new Error("Invalid email or password");
  err.status = 401;
  throw err;
}

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  const err = new Error("Invalid email or password");
  err.status = 401;
  throw err;
}
  // Generate JWT
  const payload = { id: user._id, role: user.role, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
