const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
const { authenticate } = require("./auth");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const playlists = await prisma.playlist.findMany();
    res.json(playlists);
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  const { name, description, ownerId, trackIds } = req.body;
  const tracks = trackIds.map((id) => ({ id: +id }));
  try {
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        ownerId: +ownerId,
        tracks: { connect: tracks },
      },
      include: {
        owner: true,
        tracks: true,
      },
    });
    res.json(playlist);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;
  try {
    const playlist = await prisma.playlist.findUniqueOrThrow({
      where: { id: +id },
      include: { tracks: true },
    });
    res.json(playlist);
  } catch (e) {
    next(e);
  }
});
