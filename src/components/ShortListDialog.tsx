import { Dialog, Transition } from "@headlessui/react";
import { HeartIcon } from "@heroicons/react/20/solid";
import { Book } from "@prisma/client";
import dayjs from "dayjs";
import { Fragment, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import useReservations from "~/hooks/useReservations";
import useShortlist from "~/hooks/useShortlist";

import MyReservations from "./MyReservations";

export default function ShortListDialog({ open, setOpen }) {
  const cancelButtonRef = useRef(null);
  const { shortListQuery, removeFromShortlist } = useShortlist();
  const { checkBooksAvailability, lastAvailabilityCheck, reserveBook } =
    useReservations();
  const shortList = shortListQuery.data;

  const handleCheckAvailability = async () => {
    if (shortListQuery.isLoading) return;
    await checkBooksAvailability(shortList);
  };

  const handleReserveBook = async (book: Book) => {
    await reserveBook(book);
    await checkBooksAvailability(shortList);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => setOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-auto">
          <div className="">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative m-6 bg-white p-5">
                <h2 className="flex items-center gap-x-3 text-2xl">
                  My shortlist <HeartIcon className="h-6 w-6 text-red-500" />
                </h2>
                {shortListQuery.isLoading ? (
                  <ClipLoader />
                ) : (
                  <div className="sm:flex sm:items-start">
                    <div className="mt-8 flow-root">
                      <div className="-my-2 -mx-6 overflow-x-auto lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                              <tr>
                                <th
                                  scope="col"
                                  className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                                >
                                  Title
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                                >
                                  First Author
                                </th>
                                <th
                                  scope="col"
                                  className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
                                >
                                  Available?
                                </th>

                                <th
                                  scope="col"
                                  className="relative py-3.5 pl-3 pr-6 sm:pr-0"
                                >
                                  <span className="sr-only">Available?</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {shortList?.map((book) => (
                                <tr key={book.id}>
                                  <td className="sm:pl-0whitespace-nowrap max-w-[300px]  whitespace-normal py-4 py-4 pl-6 pl-6 pr-3 pr-3 text-sm text-sm font-medium font-medium text-gray-900 text-gray-900 sm:pl-0">
                                    <button
                                      onClick={() => {
                                        removeFromShortlist.mutate(
                                          book.gutenDexId
                                        );
                                      }}
                                      className="text-red-600 hover:text-indigo-900"
                                    >
                                      Remove
                                    </button>{" "}
                                    {book.title}
                                  </td>
                                  <td className="max-w-[300px] whitespace-normal  py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                    {book.firstAuthor}
                                  </td>
                                  <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">
                                    {lastAvailabilityCheck.length === 0 ? (
                                      "?"
                                    ) : lastAvailabilityCheck
                                        .filter(
                                          (book) => book.status == "available"
                                        )
                                        .map(
                                          (book) =>
                                            book.firstAuthor + book.title
                                        )
                                        .includes(
                                          book.firstAuthor + book.title
                                        ) ? (
                                      <span>
                                        Yes
                                        <button
                                          onClick={() =>
                                            handleReserveBook(book)
                                          }
                                          className="ml-3 inline-block bg-green-300 p-2 text-gray-600"
                                        >
                                          Reserve for 2 weeks
                                        </button>
                                      </span>
                                    ) : (
                                      <span className="flex gap-x-3">
                                        No
                                        <span>
                                          Available on{" "}
                                          {new dayjs(
                                            lastAvailabilityCheck
                                              .filter(
                                                (book) =>
                                                  book.status == "unavailable"
                                              )
                                              .map((book) => ({
                                                id:
                                                  book.firstAuthor + book.title,
                                                ...book,
                                              }))
                                              .find(
                                                (book) =>
                                                  book.id ==
                                                  book.firstAuthor + book.title
                                              )?.availableOn
                                          ).format("DD/MM/YYYY")}
                                        </span>
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-5 gap-x-2 sm:mt-4 sm:flex sm:flex-row">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCheckAvailability}
                  >
                    Check for availability
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
                <MyReservations />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
