import {
  useEffect,
  useRef,
  useState,
  useCallback
} from "react";
import Globe from "react-globe.gl";
import { X, Play } from "lucide-react";

interface Country {
  geometry: any;
  properties: {
    ADMIN: string;
    NAME: string;
  };
}



export default function Globe3D() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const radioCache = useRef<Record<string, any[]>>({});
  const [showPanel, setShowPanel] = useState(false);
  const [stations, setStations] = useState<any[]>([]);
  const [currentStation, setCurrentStation] = useState<any>(null);
  const globeRef = useRef<any>(null);
  const playCountryRadio = useCallback(async (countryName: string) => {
  try {
    let data = radioCache.current[countryName];

    if (!data) {
      const response = await fetch(
        `https://de1.api.radio-browser.info/json/stations/search?country=${encodeURIComponent(countryName)}&hidebroken=true&limit=20`
      );

      data = await response.json();

      data.sort((a: any, b: any) => b.votes - a.votes);

      radioCache.current[countryName] = data;
    }

    setStations(data);

    const first = data.find(
      (s: any) => s.url_resolved?.startsWith("http")
    );

    if (!first) return;

    setCurrentStation(first);

    if (audioRef.current) {
      audioRef.current.src = first.url_resolved;
      audioRef.current.play().catch(() => {});
    }
  } catch (err) {
    console.error(err);
  }
}, []);


  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [hoverCountry, setHoverCountry] = useState<Country | null>(null);
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 80,
  });

  useEffect(() => {
    const resize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight - 80,
      });
    };

    resize();

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
      }, []);

    useEffect(() => {
      fetch("/countries.geo.json")
        .then((r) => r.json())
        .then((d) => setCountries(d.features))
        .catch(console.error);
    }, []);

    useEffect(() => {
      if (!globeRef.current) return;

      const controls = globeRef.current.controls();

      controls.autoRotate = false;
      controls.autoRotateSpeed = 0;

      controls.enableRotate = true;
      controls.enableZoom = true;
      controls.enablePan = false;

      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      globeRef.current.pointOfView(
        {
          lat: 20,
          lng: 0,
          altitude: 1.6,
        },
        1500
      );
    }, [countries]);

    const flyToCountry = (country: any) => {
    setSelectedCountry(country);
    setShowPanel(true);
    playCountryRadio(country.properties.ADMIN);
    try {
      const coords =
        country.geometry.type === "Polygon"
          ? country.geometry.coordinates[0]
          : country.geometry.coordinates[0][0];

      let lat = 0;
      let lng = 0;

      coords.forEach((c: number[]) => {
        lng += c[0];
        lat += c[1];
      });

      lat /= coords.length;
      lng /= coords.length;

      globeRef.current?.pointOfView(
        {
          lat,
          lng,
          altitude: 1.2,
        },
        1500
      );
    } catch (err) {
      console.error(err);
    }
    };

  return (
    <div className="relative w-full h-full">

      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        showAtmosphere
        atmosphereColor="#4ea5ff"
        atmosphereAltitude={0.25}
        polygonsData={countries}
        polygonAltitude={(d: any) =>
          d === selectedCountry
            ? 0.02
            : d === hoverCountry
            ? 0.01
            : 0
        }
        polygonCapColor={(d: any) => {
          if (d === selectedCountry) return "#2563eb";
          if (d === hoverCountry) return "#60a5fa";
          return "rgba(255,255,255,.15)";
        }}
        polygonSideColor={() => "rgba(0,0,0,0)"}
        polygonStrokeColor={() => "#ffffff"}
        onPolygonHover={(country: any) => {
          if (country !== hoverCountry) {
            setHoverCountry(country);
          }
          document.body.style.cursor = country ? "pointer" : "default";
        }}
        onPolygonClick={(polygon) => {
          const country = polygon as Country;

          console.log(country.properties.ADMIN);
          flyToCountry(country);
        }}
      />
     {selectedCountry && showPanel && (
        <div
          className="
            fixed
            bottom-0
            left-0
            right-0
            md:absolute
            md:top-24
            md:right-5
            md:left-auto
            md:bottom-auto
            md:w-96
            max-h-[75vh]
            rounded-t-3xl
            md:rounded-2xl
            bg-slate-900/95
            backdrop-blur-xl
            border
            border-white/10
            shadow-2xl
            z-40
            flex
            flex-col
          ">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 p-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                {selectedCountry.properties.ADMIN}
              </h2>

              {currentStation && (
                <p className="mt-1 text-sm text-gray-400">
                  🎵 {currentStation.name}
                </p>
              )}
            </div>

            <button
              onClick={() => setShowPanel(false)}
              className="rounded-full p-2 hover:bg-slate-700"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Stations */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {stations.map((station: any) => (
              <button
                key={station.stationuuid}
                onClick={() => {
                  setCurrentStation(station);

                  if (audioRef.current) {
                    audioRef.current.src = station.url_resolved;
                    audioRef.current.play();
                  }
                }}
                className={`flex w-full items-center gap-3 rounded-xl p-3 transition ${
                  currentStation?.stationuuid === station.stationuuid
                    ? "bg-blue-600"
                    : "bg-slate-800 hover:bg-slate-700"
                }`}
              >
                <Play className="h-4 w-4" />

                <div className="flex-1 text-left">
                  <p className="font-medium text-white">
                    {station.name}
                  </p>

                  <p className="text-xs text-gray-300">
                    {station.language || "Unknown"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      <audio
        ref={audioRef}
        controls
        autoPlay
        className="
          fixed
          bottom-2
          left-2
          right-2
          md:left-5
          md:right-auto
          md:w-96
          z-50
          "
      />
    </div>
  );
}