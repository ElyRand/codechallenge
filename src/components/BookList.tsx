import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import useShortlist from "~/hooks/useShortlist";

interface BookListProps {
  books: GutenDexBook[];
  prompt: SearchPrompt;
}

const BookList = ({ books, prompt }: BookListProps) => {
  const { addToShortlistMutation, shortListQuery } = useShortlist();

  const shortList = shortListQuery.data;

  const handleAddToShortlist = async (book: GutenDexBook) => {
    console.log("here");
    const validatedInput = Prisma.validator<Prisma.BookCreateInput>()({
      gutenDexId: book.id,
      title: book.title,
      firstAuthor: book.authors[0]!.name,
    });
    await addToShortlistMutation.mutateAsync(validatedInput);
  };
  console.log({ shortList });

  return (
    <div className="mt-8 flow-root">
      <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {[
                  <th
                    key="title"
                    scope="col"
                    className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Title
                  </th>,
                  <th
                    key="authors"
                    scope="col"
                    className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                  >
                    Author(s)
                  </th>,
                ][prompt.type == "author" ? "reverse" : "slice"]()}
                <th
                  scope="col"
                  className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                >
                  Lang
                </th>
                <th
                  scope="col"
                  className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                >
                  Copyrighted
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-6 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book.id}>
                  {[
                    <td
                      key={`${book.id} title ${book.title}`}
                      className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                    >
                      {shortList &&
                      shortList
                        ?.map((book) => book.gutenDexId)
                        .includes(book.id) ? (
                        <HeartIconSolid className="inline-block h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon
                          className="inline-block h-5 w-5 cursor-pointer text-red-500"
                          onClick={() => handleAddToShortlist(book)}
                        />
                      )}
                      {book.title}
                    </td>,
                    <td
                      key={`${book.id} authors ${book.title}`}
                      className="whitespace-nowrap py-4 px-3 text-sm text-gray-500"
                    >
                      {book.authors.map((author) => author.name).join(", ")}
                    </td>,
                  ][prompt.type == "author" ? "reverse" : "slice"]()}
                  <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                    {book?.languages?.join(", ")}
                  </td>
                  <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
                    {book.copyright ? "Yes" : "No"}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">
                    <button
                      onClick={() => handleAddToShortlist(book)}
                      className="text-green-600 hover:text-indigo-900"
                    >
                      {shortList &&
                      shortList
                        ?.map((book) => book.gutenDexId)
                        .includes(book.id)
                        ? ""
                        : " Add to shortlist"}
                      <span className="sr-only">, {book.name}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookList;
