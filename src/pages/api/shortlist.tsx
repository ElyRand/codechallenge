import { Prisma } from "@prisma/client";
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

import type { NextApiRequest, NextApiResponse } from "next";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  switch (req.method) {
    case "GET":
      const shortList = await fetchShortList(session);
      if (!shortList) {
        return res.status(404).json({ error: "Shortlist not found" });
      }
      return res.status(200).json(shortList.books);

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

const fetchShortList = async (session: Session) => {
  try {
    const shortList = await prisma.shortList.findUniqueOrThrow({
      where: { userId: session.user.id },
      include: {
        books: true,
      },
    });
    return shortList;
  } catch (e) {
    console.log(e);
    return null;
  }
};

// Add a new book to the shortlist
const addBookToShortlist = async (
  session: Session,
  book: Prisma.BookCreateInput
) => {
  console.log({ session });
  const req = await prisma.shortList.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      books: {
        connectOrCreate: {
          where: { gutenDexId: book.gutenDexId },
          create: book,
        },
      },
    },
    update: {
      books: {
        connectOrCreate: {
          where: { gutenDexId: book.gutenDexId },
          create: book,
        },
      },
    },
  });

  console.log({ req });
};
const removeBookFromShortlist = async (
  session: Session,
  bookIdToDelete: number
) => {
  const req = await prisma.shortList.update({
    where: { userId: session.user.id },
    data: {
      books: {
        disconnect: {
          gutenDexId: bookIdToDelete,
        },
      },
    },
  });
};

export default handler;
