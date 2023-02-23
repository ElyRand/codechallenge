import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";

const DropDownSearch = ({ setPrompt, prompt }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          {prompt.type === "title" ? "Title" : "Author"}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setPrompt((p) => ({ ...p, type: "title" }))}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Title
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setPrompt((p) => ({ ...p, type: "author" }))}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm"
                  )}
                >
                  Author
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const SearchBox = ({ setPrompt, prompt, launchSearch, setPage }) => {
  const handleKeypress = (e) => {
    // trigger search on enter key
    if (e.keyCode === 13) {
      setPage(1);
      launchSearch();
    }
  };
  return (
    <div>
      <label
        htmlFor="search"
        className="block text-sm font-medium text-gray-700"
      >
        Quick search
      </label>
      <div className="relative mt-1 flex items-center">
        <DropDownSearch setPrompt={setPrompt} prompt={prompt} />
        <input
          onKeyDown={handleKeypress}
          type="text"
          name="search"
          id="search"
          placeholder={
            prompt.type === "title" ? "Search by title" : "Search by author"
          }
          onChange={(e) => setPrompt((p) => ({ ...p, value: e.target.value }))}
          className="block w-full rounded-md border-gray-300 pr-12 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
          <kbd className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-400">
            Enter
          </kbd>
        </div>
      </div>
      <button
        onClick={() => {
          launchSearch();
          setPage(1);
        }}
        className="mt-2 rounded-xl bg-green-600 p-2 text-white"
      >
        Launch search
      </button>
    </div>
  );
};

export default SearchBox;
