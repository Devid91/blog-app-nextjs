"use client";

import { motion, AnimatePresence } from "framer-motion";
import ButtonAction from "../../buttonaction/ButtonAction";
import AnimatedHamburgerButton from "@/components/animated-hamburgermenu/AnimatedHamburgerMenu";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/public/images/logo-color.png";
import { ModalSignOut } from "@/components/modal/modalstoexport/modalvariantsserver/ModalVariantsServer";

export default function HeaderMobileScreen() {
  const [isOpen, setIsOpen] = useState(false);
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
        <span
          onClick={(prev) => setIsOpen(!prev)}
          className="flex justify-center items-center h-full group hover:underline hover:decoration-white hover:decoration-4 hover:underline-offset-[7px]"
        >
          {typeof item.name === "string" ? (
            item.name
          ) : (
            <div
              onClick={(prev) => setIsOpen(!prev)}
              className="w-14 h-14 cursor:pointer hover:scale-95  "
            >
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

  // Animation variants for the sidebar, updated for left-side slide-in
  const sidebarVariants = {
    open: {
      x: 0, // Positioned in the center (0) when open
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40,
      },
    },
    closed: {
      x: "-100%", // Move off-screen to the left
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40,
      },
    },
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
          <ButtonAction onClick={() => signIn("google")} className="text-sm">
            Sign Up with Google
          </ButtonAction>
        );
    }
  };

  return (
    <div className="flex flex-row w-full bg-transparent -z-10 h-[8vh]  ">
      <div className="sm:hidden">
        <div className="fixed top-0 right-0 z-[90]">
          <AnimatedHamburgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Sidebar */}
              <motion.div
                key="sidebar"
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariants}
                {...{
                  className:
                    "fixed left-0 top-0 h-full w-64 bg-primary-color text-white shadow-lg z-[80] p-5 overflow-auto hide-movable-scrollbar",
                }}
              >
                <div>
                  {getLinks()}
                  {renderActionButton()}
                </div>
              </motion.div>

              <div
                onClick={() => setIsOpen(false)} // Close sidebar when clicking on the overlay
                className="fixed  inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[70]"
              />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
