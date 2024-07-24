"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { useRouter } from "next/navigation";
import { ButtonGroup } from "flowbite-react";

interface Title {
  title: string;
  year: number;
  rating: number;
  description: string;
  img: string;
}

export default function Movie() {
  const router = useRouter();
  const pathname = usePathname();
  const title = decodeURIComponent(pathname.split("/").pop() || "");

  const [movie, setMovie] = useState<Title>();

  useEffect(() => {
    if (title) {
      fetch(`http://localhost:8080/movie?q=${title}`)
        .then((res) => res.json())
        .then((data) => setMovie(data));
    }
  }, [title]);

  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-24 xl:px-48">
      <div className="flex flex-col items-center justify-center p-16 shadow-xl shadow-yellow-400 border-1 border-gray-400 rounded-lg m-12">
        {movie ? (
          <>
            <div className="flex items-center p-4 shadow-lg rounded-lg ">
              <Image
                src={movie.img}
                alt={movie.title}
                width={200}
                height={200}
                className="sm:w-2/5 lg:w-1/5 h-auto rounded-lg shadow-md "
              />
              <div className="ml-12 font-mono">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
                  alt="IMDB Logo"
                  width={100}
                  height={100}
                />
                <div className="mt-10 text-3xl font-bold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
                  {movie.title}
                </div>
                <div className="text-lg text-gray-300 mt-1">
                  {movie.year} (${title})
                </div>
                <div className="text-lg text-gray-300 mt-1">
                  <b>Rating:</b> ⭐{movie.rating}/10
                </div>
                <div className="text-lg text-gray-300 mt-1 font-semibold">
                  <i>{movie.description}</i>
                </div>
              </div>
            </div>
            <ButtonGroup className="space-x-4">
              <button
                className="mb-2 bg-blue-600 text-white py-1 rounded-lg mt-4 px-8 font-mono text-xl"
                onClick={() => router.push("/")}
              >
                Back
              </button>
              <button className="mb-2 bg-red-600 text-white py-1 rounded-lg mt-4 px-8 font-mono text-xl"
                onClick={() => router.push(`https://www.imdb.com/title/${title}`)}
              >
                Go to IMDB
              </button>
            </ButtonGroup>
          </>
        ) : (
          <h1>
            <span className="text-2xl font-bold font-mono text-center">
              Loading
              <TypeAnimation
                sequence={["...", 1000, "", 1000, "..."]}
                speed={60}
                repeat={Infinity}
              />
            </span>
          </h1>
        )}
      </div>
    </div>
  );
}
