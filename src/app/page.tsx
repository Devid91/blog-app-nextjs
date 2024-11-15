"use client";

import {
  signIn,
  signOut as NextAuthSignOut,
  useSession,
  signOut,
} from "next-auth/react";
import { useRef, useState, useEffect, useCallback } from "react";
import updateUserName from "@/actions/updateUserName";
import pencil from "@/app/public/images/main-image.jpg";
import golden_frame from "@/app/public/images/golden-frame.jpg";
import ButtonAction from "@/components/buttonaction/ButtonAction";
import Image from "next/image";
import Loading from "@/components/loading/Loading";
import { validateUsername } from "./utils/lib/zodvalidation/validateUsername";
import useClickOutside from "./hooks/useClickOutside";
import useNotify from "./hooks/useNotify";

export default function Home() {
  const { data: session, status, update } = useSession();
  const [userName, setUserName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { notify } = useNotify();

  const notification = useCallback((): void => {
    return session?.user?.username === null
      ? notify("Please give a username to finish signing up", true)
      : notify(`Welcome ${session?.user?.username}`, true);
  }, [notify, session?.user?.username]);

  useClickOutside(inputRef, () => setError(null));

  useEffect(() => {
    if (status === "authenticated" && session?.user?.username === null) {
      notification();
    }
  }, [status, session?.user?.username, notification]);

  const handleUpdateUserName = async (e: React.FormEvent) => {
    e.preventDefault();

    // First, validate the username
    const validationResult = validateUsername(userName);

    if (!validationResult.success) {
      // If validation fails, set the error message
      setError(validationResult.error || null);
      return; // Exit the function early, don't send the request
    }

    // If validation passes, reset error and proceed with update
    setError(null);

    // Ensure session data is present
    if (session?.user?.email) {
      try {
        // Call the API to update the username in the database
        const result = await updateUserName(session.user.email, userName);

        if (result && result.username) {
          // Update session with the new username
          await update({
            ...session,
            user: {
              ...session.user,
              username: result.username,
            },
          });
          setUserName("");
          notification();
          // Clear input after successful update
        } else {
          console.error(
            "Username update failed: No username returned in result."
          );
        }
      } catch (error) {
        console.error("Error updating userName:", error);
      }
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "authenticated" && session?.user?.email) {
    return (
      <>
        <main className="flex flex-col lg:flex-row mx-7 lg:min-h-[100vh] lg:space-x-8 space-y-8 lg:space-y-0 justify-center lg:justify-start mt-[25px] ">
          <section className="relative flex-1 flex flex-col items-center lg:items-start text-center lg:text-left mt-[20px]">
            <div className="text-base text-center sm:text-2xl mb-[25px] min-[1700px]:pl-12 text-white">
              Welcome to your personal blog space! Log in now to unlock posts
              and start sharing your thoughts.
            </div>

            <aside className="flex justify-center items-center w-full">
              <ButtonAction
                onClick={async () => {
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
                onSubmit={handleUpdateUserName}
              >
                <div className="flex flex-col w-full">
                  <label
                    className="custom-style-for-input-label m-1 p-1 text-white flex justify-left justify-center"
                    htmlFor="name"
                  >
                    Username:
                  </label>
                  <input
                    ref={inputRef}
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
                    <div className="text-red-500 p-1 m-1 text-center">
                      {error}
                    </div>
                  )}
                </div>
                <ButtonAction>Update Username</ButtonAction>
              </form>
            </div>
            <div className="flex flex-row w-full justify-center">
              <p className="text-white">
                signed in as : {session?.user?.username}
              </p>
            </div>
          </section>

          <div className="w-full flex justify-center lg:w-auto">
            <section
              id="image-place"
              className="relative rounded-lg max-w-[320px] max-h-[280px] lg:min-w-[600px] lg:min-h-[450px] lg:max-w-[600px] lg:max-h-[450px] w-full h-auto"
            >
              <Image
                src={golden_frame}
                alt="golden-frame"
                className="w-full h-full rounded-lg"
              />
              <Image
                src={pencil}
                alt="this is the main image"
                className="absolute inset-0 m-auto w-[90%] h-[90%] object-cover rounded-lg"
              />
            </section>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main
        className="flex flex-col lg:flex-row mx-7 lg:min-h-[80vh] lg:space-x-8 space-y-8 lg:space-y-0 justify-center lg:justify-start mt-[25px] "
        id="home-page"
      >
        <section
          id="text-and-button-place"
          className="relative flex-2 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <div className="text-base text-center sm:text-2xl mb-[25px] min-[1700px]:pl-12 text-white">
            Welcome to your personal blog space! Log in now to unlock posts and
            start sharing your thoughts.
          </div>

          <aside className="flex justify-center items-center w-full">
            <ButtonAction onClick={() => signIn("google")}>
              Sign Up with Google
            </ButtonAction>
          </aside>
        </section>

        <div className="w-full flex justify-center lg:w-auto">
          <section
            id="image-place"
            className="relative rounded-lg max-w-[320px] max-h-[280px] lg:min-w-[600px] lg:min-h-[450px] lg:max-w-[600px] lg:max-h-[450px] w-full h-auto"
          >
            <Image
              src={golden_frame}
              alt="golden-frame"
              className="w-full h-full rounded-lg"
            />
            <Image
              src={pencil}
              alt="this is the main image"
              className="absolute inset-0 m-auto w-[90%] h-[90%] object-cover rounded-lg"
            />
          </section>
        </div>
      </main>
    </>
  );
}
