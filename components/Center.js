import { useState, useEffect } from "react";

import { ChevronDownIcon } from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { shuffle } from "loadsh";

import { useRecoilValue, useRecoilState } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";

import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-pink-500",
  "from-red-500",
  "from-orange-500",
  "from-yellow-500",
  "from-green-500",
  "from-teal-500",
  "from-purple-500",
];

const Center = () => {
  const { data: session } = useSession();
  const [color, setColor] = useState("#fff");
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  const playlistId = useRecoilValue(playlistIdState);

  console.log("Playlist from recoil 01::", playlist);

  const spotifyApi = useSpotify();

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("Something went wrong: ", err));
  }, [spotifyApi, playlistId]);

  console.log("Playlist from recoil 02::", playlist);

  return (
    <div className="flex-grow h-screen overflow-y-scroll">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
          onClick={signOut}
        >
          <img
            className="rounded-full w-10 h-10"
            // src={session?.user.image}
            src="https://i.pravatar.cc/150?img=68"
            alt="img"
          />
          <h2>{session?.user.name}</h2>
          <button>LogOut</button>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-6 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p className="font-bold">PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Center;
