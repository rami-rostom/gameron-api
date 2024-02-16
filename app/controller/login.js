const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const token = require('../middleware/jwt');
const bcrypt = require('bcrypt');

const controller = {
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