"use client";
import ButtonAction from "../../buttonaction/ButtonAction";
import { signIn } from "next-auth/react";

export default function HomeSignIn() {
  return (
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
  );
}
