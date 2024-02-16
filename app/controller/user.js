const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const slugify = require('slugify');
const bcrypt = require('bcrypt');

const controller = {
  getAllUsers: async (_req, res) => {
    try {
      const users = await prisma.user.findMany();

      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json(error.toString());
    }
  },

  getOneUser: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: {
          id: Number(id),
        }
      });

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json(error.toString());
    }
  },

  createUser: async (req, res) => {
    try {
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

      // Hash password
      const passwordHashed = await bcrypt.hash(password, 10);

      await prisma.user.create({
        data: {
          email,
          username,
          username_slug: usernameSlugified,
          password: passwordHashed,
          is_admin: false,
        }
      });

      res
        .status(201)
        .json({ message: "User successfully created, you can now login." });
    } catch (error) {
      console.log(error);
      res.status(500).json(error.toString());
    }
  },
}

module.exports = controller;