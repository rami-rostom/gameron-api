const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const token = require('../middleware/jwt');
const bcrypt = require('bcrypt');
const slugify = require('slugify');

const controller = {
  handleRegister: async (req, res) => {
    // Email must have characters before and after @, and 2 to 4 characters after the dot.
    const EMAIL_REGEX = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/gm;

    // Password require at least 8 characters, 1 capital letter and 1 number.
    const PASSWORD_REGEX =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm;

    const { email, username, password, confirmation } = req.body;

    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ error: "Missing parameter(s)." });
    }

    if (password !== confirmation) {
      return res
        .status(400)
        .json({ error: "Password and confirmation isn't matching." });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res
        .status(400)
        .json({ error: "Email is not valid." });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res
        .status(400)
        .json({
          error:
            "Password invalid (must be at least 8 characters, include one number, one capital letter and one special character).",
        });
    }

    // Verification for unique email
    const emailCheck = await prisma.user.findFirst({
      where: { email },
    });

    if (emailCheck) {
      return res
        .status(400)
        .json({
          error: "Email already used. Please try with a different email.",
        });
    }

    // Verification for unique username
    const usernameCheck = await prisma.user.findFirst({
      where: { username },
    });

    if (usernameCheck) {
      return res
        .status(400)
        .json({
          error: "Username already used. Please try with a different one.",
        });
    }

    // Slugify username
    const usernameSlugified = slugify(username, { lower: true });

    const passwordHashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        username,
        username_slug: usernameSlugified,
        password: passwordHashed,
        is_admin: false,
      },
    })

    res
      .status(201)
      .json({ message: "User successfully created, you can now login." });
  },

  handleLogin: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Missing parameter(s)." });
    }

    const userFound = await prisma.user.findFirst({
      where: { email },
    });

    if (!userFound) {
      return res
        .status(400)
        .json({ error: "This user doesn't exist." });
    }

    // Function is launch if the password match with the decrypted password. It will also generate JWT tokens.
    const verificationAuthBcrypt = (_errBcrypt, resBcrypt) => {
      if (resBcrypt) {
        return res.status(200).json({
          userId: userFound.id,
          username: userFound.username,
          username_slug: userFound.username_slug,
          token: `Bearer ${token.generateAccessToken(userFound)}`,
          refreshToken: `Bearer ${token.generateRefreshToken(userFound)}`,
        });
      } else {
        return res
          .status(400)
          .json({ error: "Please verify provided credentials." });
      }
    };

    bcrypt.compare(password, userFound.password, verificationAuthBcrypt);
  }
}

module.exports = controller;