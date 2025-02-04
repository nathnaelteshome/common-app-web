import Image from "next/image";
import { Epilogue } from "next/font/google";
const epilogue = Epilogue({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "600", "700", "800"],
});
const TopBar = () => {
  return (
    <div
      className={` h-96 flex justify-center items-center  relative ${epilogue.className} uppercase `}
    >
      <Image
        className="-z-10"
        src="/assets/landing-page/topimage.png"
        fill
        alt="top"
      />
      <h1 className="text-6xl font-bold text-white mt-[-80px]">Find College</h1>
    </div>
  );
};

export default TopBar;
