const { User } = require("../model/user");
const { HttpError } = require("../helpers/helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { JWT_SECRET } = process.env;

async function register(req, res, next) {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const avatarUrl = gravatar.url(email);
  try {
    const newUser = await User.create({
      email,
      password: hashedPassword,
      avatarUrl,
    });

    res.status(201).json({
      data: {
        user: {
          email,
          id: newUser._id,
        },
      },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      throw new HttpError(409, "User with this email already exists");
    }

    throw error;
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const loginUser = await User.findOne({
    email,
  });
  if (!loginUser) {
    throw new HttpError(401, "email is not valid");
  }
  const isPasswordValid = await bcrypt.compare(password, loginUser.password);
  if (!isPasswordValid) {
    throw new HttpError(401, "Email or password is wrong");
  }
  const token = jwt.sign({ id: loginUser._id }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return res.json({
    data: {
      token,
    },
  });
}

async function logout(req, res, next) {
  const { _id } = req.body;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
}

async function getCurrent(req, res, next) {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
}

async function uploadAvatar(req, res, next) {
  const { filename } = req.file;
  const tmpPath = path.resolve(__dirname, "../tmp", filename);
  const publicPath = path.resolve(__dirname, "../public", filename);
  const avatarUrl = path.join("avatar", filename);
 
  try {
    await fs.rename(tmpPath, publicPath);
    const userId = req.params.id;
    Jimp.read(avatarUrl)
  .then(filename => {
    return filename
      .resize(250, 250) // resize
      .write(avatarUrl); // save
  })
  .catch(err => {
    err;
  });
  await User.findByIdAndUpdate(userId, { avatarUrl });
  return res.json({
    message: "Avatar updated",
  });
  } catch (error) {
    await fs.unlink(tmpPath);
    throw error;
  }
  

}

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  uploadAvatar,
};
