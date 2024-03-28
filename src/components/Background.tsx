import React from "react";
import BackgroundImage from "../assets/todos-background.jpg";

export default function BackGround(): React.JSX.Element {
  return (
    <div className="absolute z-[-1] flex h-screen w-full flex-col items-center justify-center">
      <img
        src={BackgroundImage}
        alt="Background"
        className="object-cover w-full h-screen"
      />
    </div>
  );
}
