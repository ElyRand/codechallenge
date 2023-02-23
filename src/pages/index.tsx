import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
} from "@heroicons/react/20/solid";
import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import BookList from "~/components/BookList";
import SearchBox from "~/components/SearchBox";
import ShortListDialog from "~/components/ShortListDialog";

const defaultPrompt: SearchPrompt = {
  type: "title",
  value: "",
};

const Home: NextPage = () => {
  const [data, setData] = useState<GutenDexData>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shortlistDialogOpen, setShortListDialogOpen] = useState(false);
  const [prompt, setPrompt] = useState<SearchPrompt>(defaultPrompt);
  const { status, data: userData } = useSession();
  console.log({ userData });
  const router = useRouter();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const launchSearch = async () => {
    setLoading(true);
    setPage(1);
    const searchParams = new URLSearchParams();
    searchParams.append("page", page.toString());

    if (prompt.value !== "") {
      searchParams.append("search", prompt.value);
    }

    await fetch(`https://gutendex.com/books?` + searchParams.toString())
      .then((response) => response.json())
      .then((data) => setData(data as GutenDexData))
      .catch((error) => console.error(error));

    setLoading(false);
  };

  useEffect(() => {
    launchSearch();
    console.log("useEffect");
  }, [page]);

  const handlePreviousPage = () => {
    setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handleShortlistOpen = async () => {
    if (status === "authenticated") {
      setShortListDialogOpen(true);
    } else if (status === "unauthenticated") {
      await router.push("/auth/signin");
    }
  };

  if (!data) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-600/10">
        <ClipLoader className="h-20 w-20" color="black" size={40} />
      </div>
    );
  } else {
    const { count, results } = data;

    return (
      <div className="px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Books</h1>
            {loading ? <ClipLoader className="inline-block" /> : null}
          </div>
          <div className="mt-4 flex items-center gap-x-3 sm:mt-0 sm:ml-16 sm:flex-none">
            {status === "authenticated" && (
              <div>
                Welcome, <b>{userData?.user?.email}</b>
                <button
                  onClick={() => signOut()}
                  className="block text-sm font-bold italic text-gray-400 "
                >
                  Signout
                </button>
              </div>
            )}
            <button
              type="button"
              className="flex items-center gap-x-2 rounded-md bg-indigo-600 py-1.5 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleShortlistOpen}
            >
              My shortlist
              <HeartIcon className="inline-block h-5 w-5 text-red-500" />
            </button>
            <ShortListDialog
              open={shortlistDialogOpen}
              setOpen={setShortListDialogOpen}
            />
          </div>
        </div>
        <div className="mt-10 lg:max-w-[50vw]">
          <SearchBox
            setPrompt={setPrompt}
            prompt={prompt}
            launchSearch={launchSearch}
          />
        </div>
        <BookList books={results} prompt={prompt} />
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <a
              href="#"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </a>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(page - 1) * results.length + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {(page - 1) * results.length + 1 + results.length}
                </span>{" "}
                of <span className="font-medium">{count}</span> results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(count / results.length, p + 1))
                  }
                  className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Home;
