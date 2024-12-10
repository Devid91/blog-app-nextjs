"use client";

import ButtonAction from "../../buttonaction/ButtonAction";
import { signOut as NextAuthSignOut, signOut } from "next-auth/react";
import useGlobalStore from "@/store/store";

import { forwardRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

type HomeSignOutProps = {
  handleUpdateUserName: () => void;
  sessionUsername: string | null | undefined;
  queryError: Error | null;
};

const HomeSignOut = forwardRef<HTMLInputElement, HomeSignOutProps>(
  ({ handleUpdateUserName, sessionUsername, queryError }, ref) => {
    const userName = useGlobalStore((state) => state.userName);
    const setUserName = useGlobalStore((state) => state.setUserName);
    const error = useGlobalStore((state) => state.error);

    const queryClient = useQueryClient();

    const clearReactQueryCache = async () => {
      queryClient.clear();
      localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
    };

    return (
      <section className="relative flex-1 flex flex-col items-center lg:items-start text-center lg:text-left mt-[20px]">
        <div className="text-base text-center sm:text-2xl mb-[25px] min-[1700px]:pl-12 text-white">
          Welcome to your personal blog space! Log in now to unlock posts and
          start sharing your thoughts.
        </div>

        <aside className="flex justify-center items-center w-full">
          <ButtonAction
            onClick={async () => {
              await clearReactQueryCache();
              await signOut();
              await NextAuthSignOut();
            }}
          >
            Sign Out
          </ButtonAction>
        </aside>

        <div className="flex flex-row place-content-center w-full max-w-5xl mx-auto">
          <form
            className="flex justify-center flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateUserName(); // Call the passed-in handler
            }}
          >
            <div className="flex flex-col w-full">
              <label
                className="custom-style-for-input-label m-1 p-1 text-white flex justify-left justify-center"
                htmlFor="name"
              >
                Username:
              </label>
              <input
                ref={ref}
                title="name"
                type="text"
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
                placeholder="set username..."
                className={`w-full rounded-lg p-2 border-2 border-primary-color input-focus text-center ${
                  error ? "" : "mb-5"
                }`}
                name="name"
              />
              {error && (
                <div className="text-red-500 p-1 m-1 text-center">{error}</div>
              )}
            </div>
            <ButtonAction onClick={() => queryClient.clear()}>
              Update Username
            </ButtonAction>
          </form>
        </div>
        <div className="flex flex-row w-full justify-center">
          {queryError ? (
            <div className="text-red-500 p-1 m-1 text-center">
              Something went wrong , please try again
            </div>
          ) : (
            <p className="text-white">signed in as : {sessionUsername}</p>
          )}
        </div>
      </section>
    );
  }
);

HomeSignOut.displayName = "HomeSignOut";

export default HomeSignOut;
