import type { NextApiRequest, NextApiResponse } from "next";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":

    case "POST":
      const book = Prisma.validator<Prisma.BookCreateInput>()(
        req.body as Prisma.BookCreateInput
      );
      await addBookToShortlist(session, book);
      return res.status(204).end();

    case "DELETE":
      console.log("delete");
      const bookIdToDelete = req.body as number;
      await removeBookFromShortlist(session, bookIdToDelete);
      return res.status(204).end();
  }
};

const getReservations = async (username: string) => {};

const checkBookAvailability = async (bookId: number) => {};

const reserveBook = async (bookId: number) => {
  const req = await prisma.reservation.create({
    data: {},
  });
};

export default handler;
