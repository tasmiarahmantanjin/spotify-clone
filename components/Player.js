import { debounce } from "loadsh";
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  SwitchHorizontalIcon,
  VolumeUpIcon,
} from "@heroicons/react/outline";

import {
  RewindIcon,
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/solid";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

const Player = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(25);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now Playing: ", data?.body?.item);
        setCurrentTrackId(data?.body?.item?.id);

        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data?.body?.is_playing);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data?.body?.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackIdState) {
      // Fetch the song info
      fetchCurrentSong();
      setVolume(25);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  // Handle volume debounce
  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  // Handle volume debounce
  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => console.log(err));
    }, 5000),
    []
  );

  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-red-900 text-white 
    grid grid-cols-3 text-xs md:text-base px-2 md:px-8 "
    >
      {/* Grid Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album?.images?.[0].url}
          alt=""
        />

        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
        <HeartIcon className="h-6 w-6 text-red-500" />
      </div>

      {/* Grid Center */}
      <div className="flex  items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon className="button" />

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}

        <FastForwardIcon className="button" />
        <ReplyIcon className="button" />
      </div>

      {/* Grid Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          conClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          className="button"
          conClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
};

export default Player;