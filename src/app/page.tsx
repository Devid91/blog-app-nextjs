"use client";

import { useSession } from "next-auth/react";
import { useRef, useEffect, useCallback, useState, useTransition } from "react";
import updateUserName from "@/actions/updateUserName";
import Loading from "@/components/loading/Loading";
import { validateUsername } from "./utils/lib/zodvalidation/validateUsername";
import useClickOutside from "./hooks/useClickOutside";
import useNotify from "./hooks/useNotify";
import useGlobalStore from "@/store/store";
import HomeSignIn from "@/components/home/homesignin/HomeSignIn";
import HomeSignOut from "@/components/home/homesignout/HomeSignOut";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import HomeMainLayer from "@/components/home/homemainlayer/HomeMainLayer";

export default function Home() {
  const { data: session, status, update } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);

  const userName = useGlobalStore((state) => state.userName); // input field state
  const setUserName = useGlobalStore((state) => state.setUserName);
  const setError = useGlobalStore((state) => state.setError); // if an error occur during typing or not valid input value

  const authenticated = status === "authenticated";
  const authLoading = status === "loading";
  const sessionEmail = session?.user?.email ?? null;

  const fetchConditions =
    authenticated &&
    sessionEmail &&
    (session?.user?.username === null || session?.user?.username === undefined);

  //notify the status of the user auth current state
  const { notify } = useNotify();

  //close error message
  useClickOutside(inputRef, () => setError(null));

  /* set Loading "Loading..." screen to update session, username and the DB username values*
loading... only seen be the initial loading time but not while username updated
this is because the state from loading...to main layout happens double while updating and session.user,username is null
soo the timeout set to 2 seconds to have time to update state, session and DB and not experience too uch layout shift
*/
  const setWaitBackGroundFetches = useGlobalStore(
    (state) => state.setWaitBackGroundFetches
  );
  const waitBackGroundFetches = useGlobalStore(
    (state) => state.waitBackGroundFetches
  );

  // Timeout tracking for minimum loading duration, otherwise the initially the session state keeps loading... forever
  const timeoutComplete = useGlobalStore((state) => state.timeoutComplete);
  const setTimeoutComplete = useGlobalStore(
    (state) => state.setTimeoutComplete
  );

  // Fetch user data using React Query ,set the conditions when to fetch
  const {
    isLoading: isUserLoading,
    data: queryUserData,
    error: queryError,
  } = useQuery({
    queryKey: ["user", sessionEmail],
    queryFn: async () => {
      const response = await axios.post(
        "http://localhost:3000/api/auth/get-user-by-email",
        { email: sessionEmail }
      );
      return response.data.user;
    },
    enabled: Boolean(fetchConditions),
  });

  // Manage loading duration with a minimum of 2 seconds
  useEffect(() => {
    // Start timeout for 2 seconds
    const timer = setTimeout(() => {
      setTimeoutComplete(true);
    }, 2000);

    // Clear timeout on cleanup
    return () => clearTimeout(timer);
  }, []);

  //let the state true to be able to fetch query by all conditions set to true

  useEffect(() => {
    if (authLoading || isUserLoading) {
      setWaitBackGroundFetches(true);
    } else {
      const timer = setTimeout(() => {
        setWaitBackGroundFetches(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [authLoading, isUserLoading]);

  // Effect to handle session update after user data is fetched
  useEffect(() => {
    if (
      queryUserData?.username &&
      queryUserData.username !== session?.user?.username
    ) {
      setWaitBackGroundFetches(true);

      update({
        ...session,
        user: {
          ...session?.user,
          username: queryUserData.username,
        },
      });

      setWaitBackGroundFetches(false);
    }
  }, [queryUserData, session, update]);

  const [, startTransition] = useTransition();

  const handleUpdateUserName = useCallback(() => {
    startTransition(async () => {
      if (!session?.user?.email) return;

      setWaitBackGroundFetches(true); // Indicate username update is in progress

      const validationResult = validateUsername(userName);
      if (!validationResult.success) {
        setError(validationResult.error || null);
        setWaitBackGroundFetches(false);
        return;
      }

      try {
        const result = await updateUserName(session.user.email, userName);

        if (result?.error) {
          // Display error returned from the backend
          setError(result.error);
          console.error("Username update failed:", result.error);
        } else if (result?.username) {
          // Successfully updated username
          await update({
            ...session,
            user: {
              ...session.user,
              username: result.username,
            },
          });
          setUserName("");
          setError(null); // Clear any previous error
        }
      } catch (error) {
        console.error("Error updating username:", error);
        setError("An unexpected error occurred while updating the username.");
      } finally {
        setWaitBackGroundFetches(false);
      }
    });
  }, [session, userName, setError, update, setUserName]);

  useEffect(() => {
    /*Only run the effect if session is authenticated and the username is still null
   if timeout was not introduced then each signin is
   always null before DB fetch */
    if (authenticated && session?.user?.username === null) {
      const timer = setTimeout(() => {
        if (authenticated && session?.user?.username === null) {
          // Notify after 2 seconds if the username is still null
          notify(`Please give a username to finish signup`, false);
        }
      }, 2000); // 2-second delay

      return () => clearTimeout(timer);
    }
  }, [authenticated, session?.user?.username, notify]);

  // Ensure loading... happens to set the setter true or session is updating
  // && !timeoutComplete >> prevent the bug to double layout shift to deny it
  if ((waitBackGroundFetches || authLoading) && !timeoutComplete) {
    return <Loading />;
  }

  return (
    <>
      <main className="flex flex-col lg:flex-row mx-7 lg:min-h-[100vh] lg:space-x-8 space-y-8 lg:space-y-0 justify-center lg:justify-start mt-[25px]">
        <div className="relative min-h-[450px] w-full lg:w-[350px] flex-shrink-0">
          {authenticated && session?.user?.email ? (
            <HomeSignOut
              sessionUsername={session?.user?.username}
              handleUpdateUserName={handleUpdateUserName}
              ref={inputRef}
              queryError={queryError}
            />
          ) : (
            <HomeSignIn />
          )}
        </div>

        <div className="flex-grow">
          <HomeMainLayer />
        </div>
      </main>
    </>
  );
}
