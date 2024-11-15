"use client";

import ButtonAction from "../../buttonaction/ButtonAction";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import logo from "@/app/public/images/logo-color.png";
import Image from "next/image";
import { ModalSignOut } from "@/components/modal/modalstoexport/modalvariantsserver/ModalVariantsServer";

export default function HeaderPCScreen() {
  const { data: session, status } = useSession();

  const links = ["Home", "About", "Write", "Blog-post"];

  // Transform the links array
  const transformedLinks = links.map((item) => {
    const url = item === "Home" ? "/" : `${item.toLocaleLowerCase()}`;
    const itemName = item === "Home" ? logo : item; // If it's "Home", set the itemName to the logo image

    return { name: itemName, url: url };
  });

  const getLinks = () => {
    return transformedLinks.map((item, index) => (
      <Link href={item.url} key={index}>
        <span className="flex justify-center items-center h-full group hover:underline hover:decoration-white hover:decoration-4 hover:underline-offset-[7px]">
          {typeof item.name === "string" ? (
            item.name
          ) : (
            <div className="w-14 h-14 cursor:pointer hover:scale-95  ">
              <Image
                src={item.name}
                alt="Home Logo"
                className="w-full h-full rounded-full"
              />
            </div>
          )}
        </span>
      </Link>
    ));
  };

  const renderActionButton = () => {
    switch (status) {
      case "authenticated":
        // If authenticated and user email exists, show the sign-out modal
        return session?.user?.email ? <ModalSignOut /> : null;

      case "loading":
        // Show a loading button if the session status is loading
        return (
          <ButtonAction className="texts-sm mb-0 cursor-default">
            Loading...
          </ButtonAction>
        );

      default:
        // Show the Google Sign In button if user is not authenticated
        return (
          <ButtonAction
            onClick={() => signIn("google")}
            className="mb-0 p-0 text-xs w-[70%]"
          >
            Sign Up with Google
          </ButtonAction>
        );
    }
  };

  return (
    <div
      className="flex flex-row  justify-between items-center h-[8vh] w-full text-secondary-color text-xl z-[39] px-2
      bg-primary-color max-sm:bg-transparent max-sm:justify-end"
    >
      {/* Container for the text items (title, again, over, hello) */}
      <div className="flex flex-row justify-between w-full max-w-[80%] max-sm:hidden">
        {getLinks()}
      </div>

      {/* Sign In button aligned to the right */}
      <span className="flex justify-center items-center h-full ml-auto max-sm:ml-0 max-sm:hidden">
        {renderActionButton()}
      </span>
    </div>
  );
}
