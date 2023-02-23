import { type Book } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface AvailabilityCheck {
  title: string;
  firstAuthor: string;
  status: "available" | "unavailable";
}

const useReservations = () => {
  const [lastAvailabilityCheck, setLastAvailabilityCheck] = useState<
    AvailabilityCheck[]
  >([]);
  const [myReservations, setMyReservations] = useState<Book[]>([]);
  const { data: userData } = useSession();

  const checkBooksAvailability = async (books: Book[]) => {
    const promises = books?.map((book) =>
      fetch(
        `/api/reservations?` +
          new URLSearchParams({
            title: book.title,
            firstAuthor: book.firstAuthor,
          }).toString()
      ).then((res) => res.json() as AvailabilityCheck)
    );

    const results = await Promise.all(promises);

    setLastAvailabilityCheck(results);
  };

  const reserveBook = async (book: Book) => {
    try {
      await fetch(`/api/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ book, username: userData?.user.email }),
      });
      await fetchMyReservations();
    } catch (e) {
      console.log("error reserving book", e);
    }
  };

  const fetchMyReservations = async () => {
    if (!userData?.user.email) {
      console.log("user not logged in");
      return;
    }
    const reservations = await fetch(
      `/api/reservations/me?username=${userData?.user.email}`
    ).then((res) => res.json() as Book[]);

    setMyReservations(reservations);
  };

  return {
    checkBooksAvailability,
    lastAvailabilityCheck,
    reserveBook,
    fetchMyReservations,
    myReservations,
  };
};

export default useReservations;
