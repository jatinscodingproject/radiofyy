import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  Radio,
} from "lucide-react";

interface Station {
  name: string;
  url_resolved: string;
}

interface Props {
  station: Station | null;
  country: string;
}

export default function RadioPlayer({
  station,
  country,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!station || !audioRef.current) return;

    audioRef.current.src = station.url_resolved;

    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(console.error);
  }, [station]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const changeVolume = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Number(e.target.value);

    setVolume(value);

    if (audioRef.current) {
      audioRef.current.volume = value;
    }
  };

  return (
    <div className="fixed bottom-6 left-6 w-96 rounded-2xl border border-white/10 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl">

      <audio ref={audioRef} />

      <div className="flex items-center gap-3">

        <div className="rounded-full bg-blue-600 p-3">
          <Radio className="text-white" />
        </div>

        <div>

          <h2 className="text-lg font-bold text-white">
            {station?.name ?? "No Station"}
          </h2>

          <p className="text-gray-400">
            {country}
          </p>

        </div>

      </div>

      <div className="mt-6 flex items-center gap-4">

        <button
          onClick={togglePlay}
          className="rounded-full bg-blue-600 p-4 hover:bg-blue-700 transition"
        >
          {playing ? (
            <Pause className="text-white" />
          ) : (
            <Play className="text-white" />
          )}
        </button>

        <Volume2 className="text-white" />

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={changeVolume}
          className="flex-1 accent-blue-600"
        />

      </div>

      <div className="mt-5">

        <p className="text-sm text-gray-400">
          Live Internet Radio
        </p>

      </div>

    </div>
  );
}