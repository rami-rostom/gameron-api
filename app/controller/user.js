const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
          id: Number(id)
        }
      });

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json(error.toString());
    }
  },
}

module.exports = controller;