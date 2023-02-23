import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      const { username } = req.query as { username: string };
      const reservations = await getReservations(username);
      return res.status(200).json(reservations);
    default:
      return res.status(405).end();
  }
};

const getReservations = async (username: string) => {
  return await prisma.reservation.findMany({
    where: {
      username,
      end: {
        gte: new dayjs().startOf("day").toDate(),
      },
    },
    include: {
      book: true,
    },
  });
};

export default handler;
