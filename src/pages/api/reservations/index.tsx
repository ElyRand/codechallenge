import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

interface Book {
  title: string;
  firstAuthor: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET": {
      const book = req.query as Book;
      const reservation = await checkBookAvailability(book);
      if (!reservation)
        return res.status(200).json({ ...book, status: "available" });
      else if (reservation)
        return res.status(200).json({
          ...book,
          status: "unavailable",
          availableOn: new dayjs(reservation.end).add(1, "day").toDate(),
        });
    }
    case "POST":
      const { username, book } = req.body as { username: string; book: Book };
      console.log({ book });
      await reserveBook(username, book);
      return res.status(204).end();

    case "DELETE":
      console.log("delete");
      const bookIdToDelete = req.body as number;
      await removeBookFromShortlist(session, bookIdToDelete);
      return res.status(204).end();

    default:
      return res.status(405).end();
  }
};

const checkBookAvailability = (book: {
  title: string;
  firstAuthor: string;
}) => {
  // Check if the book has any ongoing reservations
  return prisma.reservation.findFirst({
    where: {
      book: {
        title: book.title,
        firstAuthor: book.firstAuthor,
      },
      end: {
        gte: new dayjs().startOf("day").toDate(),
      },
    },
  });
};

const reserveBook = async (username: string, book: Prisma.BookCreateInput) => {
  try {
    //check if a reservation already exists for this book
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        username: username,
        book: {
          title: book.title,
          firstAuthor: book.firstAuthor,
        },
        end: {
          gte: new dayjs().startOf("day").toDate(),
        },
      },
    });

    if (existingReservation) return existingReservation;

    return prisma.reservation.create({
      data: {
        username,
        start: new dayjs().startOf("day").toDate(),
        end: new dayjs().startOf("day").add(2, "week").toDate(),
        book: {
          connectOrCreate: {
            where: {
              title_firstAuthor: {
                title: book.title,
                firstAuthor: book.firstAuthor,
              },
            },
            create: {
              title: book.title,
              firstAuthor: book.firstAuthor,
              gutenDexId: book.gutenDexId,
            },
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default handler;
