import { Epilogue } from "next/font/google";
import Link from "next/link";
const epilogue = Epilogue({
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "600", "700", "800"],
});
const NewLetter = () => {
  return (
    <div
      className={` ${epilogue.className} bg-primary flex-col flex md:flex-row `}
    >
      {/* left section */}
      <div className="flex-1 flex text-white flex-col gap-4 justify-center p-12 min-h-80">
        <h1 className="text-4xl lg:text-6xl font-bold tracking-wide">
          Join Our Newsletter
        </h1>
        <p className="text-xl lg:text-2xl">
          Subscribe our newsletter to get our latest update & news.
        </p>
      </div>

      {/* right section */}
      <div className="flex-1 flex justify-center items-center border border-primary">
        <div className="flex p-2 bg-white rounded-md w-fit">
          <input
            type="text"
            placeholder="Enter your email:"
            className="focus:outline-none"
          />
          <Link
            href="/subscribe"
            className="bg-black py-2 px-4 text-center text-white flex items-center rounded-md "
          >
            Subscribe Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewLetter;
