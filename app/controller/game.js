const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const controller = {
  getUserFavoriteGames: async (req, res) => {
    try {
      const { id } = req.params;

      const userGames = await prisma.game.findMany({
        where: {
          userId: Number(id),
        }
      })

      res.status(200).json(userGames);
    } catch (error) {
      console.log(error);
      res.status(500).json(error.toString());
    }
  },

  updateGameFavorite: async (req, res) => {
    try {
      const {
        userId, gameId, name, slug, released, rating, background_image
      } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        }
      });

      if (!user) {
        return res
          .status(400)
          .json({ error: "User not found." });
      }

      // Check if game is already liked by the user
      const isGameFavorite = await prisma.game.findFirst({
        where: {
          userId,
          gameId,
        },
      });
    
      // If true, the game is remove from favorites
      if (isGameFavorite) {
        await prisma.game.delete({
          where: {
            id: isGameFavorite.id
          },
        });

        res
        .status(200)
        .json({ message: "Game successfully removed from favorites." });
      } else {
        // If false, the game is add to favorites
        await prisma.game.create({
          data: {
            user: {
              connect: { id: userId },
            },
            gameId,
            name,
            slug,
            released,
            rating,
            background_image
          },
        });
  
        res
          .status(201)
          .json({ message: "Game successfully added to favorites." });
      }

    } catch (error) {
      console.log(error);
      res.status(500).json(error.toString());
    }
  }
}

module.exports = controller;