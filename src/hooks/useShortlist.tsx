import { Prisma } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const useShortlist = () => {
  const { status } = useSession();

  const shortListQuery = useQuery({
    queryKey: ["shortlist"],
    queryFn: () =>
      fetch("/api/shortlist")
        .then((res) => {
          if (res.status === 401) {
            return [];
          }
          if (res.ok) {
            return res.json();
          }
        })
        .catch((err) => console.log("error querying shortlist", err)),
  });

  const addToShortlistMutation = useMutation({
    mutationFn: async (book: Prisma.BookCreateInput) => {
      return fetch("/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(book),
      });
    },
    onSuccess: () => shortListQuery.refetch(),
  });

  const removeFromShortlist = useMutation({
    mutationFn: async (bookId: number) => {
      return fetch("/api/shortlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookId),
      });
    },
    onSuccess: () => shortListQuery.refetch(),
  });

  return { addToShortlistMutation, shortListQuery, removeFromShortlist };
};

export default useShortlist;
