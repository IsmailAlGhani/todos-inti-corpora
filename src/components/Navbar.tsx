import React from "react";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { FcTodoList } from "react-icons/fc";
import { Button } from "./ui/button";

export default function Navbar(): React.JSX.Element {
  return (
    <nav className="flex h-full flex-row items-center justify-between font-semibold">
      <Button
        variant={"ghost"}
        className="flex aspect-square h-full hover:bg-transparent items-center justify-center"
      >
        <FcTodoList className="h-10 w-10 cursor-pointer" />
      </Button>
      <div className="hidden md:flex mr-2 h-full justify-center items-center">
        <ThemeToggleButton />
      </div>
    </nav>
  );
}
