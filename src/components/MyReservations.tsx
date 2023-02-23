import dayjs from "dayjs";
import { useEffect } from "react";
import useReservations from "~/hooks/useReservations";

const MyReservations = () => {
  const { fetchMyReservations, myReservations } = useReservations();

  useEffect(() => {
    void fetchMyReservations();
  }, []);

  return (
    <>
      <h2 className="mt-10 flex items-center gap-x-3 text-2xl">
        My Reservations{" "}
        <button
          onClick={fetchMyReservations}
          className="text-md rounded-xl bg-green-500 p-2 text-white"
        >
          Refresh
        </button>
      </h2>
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
                      Return before
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {myReservations.map(({ end, book }) => (
                    <tr key={book.id}>
                      <td className="sm:pl-0whitespace-nowrap max-w-[300px]  whitespace-normal py-4 py-4 pl-6 pl-6 pr-3 pr-3 text-sm text-sm font-medium font-medium text-gray-900 text-gray-900 sm:pl-0">
                        {book.title}
                      </td>
                      <td className="max-w-[300px] whitespace-normal  py-4 pl-6 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {book.firstAuthor}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium sm:pr-0">
                        {new dayjs(end).format("DD/MM/YYYY")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyReservations;
