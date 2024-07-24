"use client";

import Image from "next/image";
import SearchAction from "../functions/SearchAction";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Popover } from "flowbite-react";
import { TypeAnimation } from "react-type-animation";
import ReactStars from "react-stars";

export interface SearchResult {
  title: string;
  year: number;
  rating: number;
  description: string;
  img: string;
  id: string;
}

export default function ImdbComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([] as SearchResult[]);

  const handleSearch = async () => {
    setSearchResults([]);
    const results = await SearchAction(searchQuery);
    setSearchResults(results);
  };

  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center p-16 mt-8 mb-8 space-y-4 shadow-xl rounded-3xl shadow-yellow-700 ">
      <TypeAnimation
        sequence={["Search for a movie", 1000, "Or a TV show", 1000]}
        wrapper="span"
        speed={30}
        style={{ fontSize: "1em", display: "inline-block" }}
        repeat={Infinity}
        className="text-2xl font-bold font-mono text-center"
      />
      <div
        title="searchBox"
        className="flex flex-col items-center justify-center"
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg"
          alt="IMDB Logo"
          width={120}
          height={120}
        />
        <div className="text-xl font-bold font-mono mt-2">IMDB Search</div>
        <input
          type="text"
          placeholder="Search for a movie"
          className="mt-4 border-2 border-gray-400 px-4 py-2 rounded-lg w-72 text-gray-800 font-bold"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white py-1 rounded-lg mt-4 px-8 font-mono text-xl"
          onClick={handleSearch}
        >
          Search
        </button>
        <ReactStars count={5} size={30} color2={"#ffd700"} />
      </div>
      <div className="grid gap-4 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {searchResults.map((result) => (
          <div key={result.title} className="">
            <Popover
              placement="top"
              content={
                <div className="flex flex-col items-center justify-center px-4 py-2 space-y-2 bg-slate-800 text-white rounded-lg">
                  <div className="text-xs font-bold">{result.title}</div>
                </div>
              }
              trigger="hover"
            >
              <Image
                src={result.img}
                alt="Movie Poster"
                width={150}
                height={207}
                className="rounded-t-lg rounded-b-lg"
                onClick={() => router.push(`/movie/${result.id}`)}
              />
            </Popover>
          </div>
        ))}
      </div>
    </div>
  );
}
