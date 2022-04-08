const prisma = require("../utils/prisma");

const getScreen = async (req, res) => {
  console.log(req.params);
  const screen = await prisma.screen.findUnique({
    where: {
      id: Number(req.params.id),
    },
    include: {
      seats: true,
      screenings: true,
    },
  });
  res.json({ screen: screen });
};

const addTicket = async (req, res) => {

const { screeningId, customerId, seatId } = req.body

  const ticket = await prisma.ticket.create({
    data: {
      seats: {
        connect: [{ id: seatId}],
      },
      screening: {
        connect: {
          id: screeningId,
        },
      },
      customer: {
        connect: {
          id: customerId,
        },
      },
    },
    include: {
        screening: true,
        customer: true,
        seats: true
    }
  });

  res.json({ ticket: ticket });
};

module.exports = {
  getScreen,
  addTicket,
};
