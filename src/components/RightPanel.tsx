export default function RightPanel() {

    return (

        <div className="absolute right-5 top-32 z-40 hidden lg:block">
            <div className="w-80 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-6">

                <h2 className="text-2xl font-bold text-white">
                    About Earth
                </h2>

                <div className="mt-8 space-y-5 text-gray-300">

                    <div className="flex justify-between">

                        <span>Type</span>

                        <span>Terrestrial</span>

                    </div>

                    <div className="flex justify-between">

                        <span>Diameter</span>

                        <span>12,742 km</span>

                    </div>

                    <div className="flex justify-between">

                        <span>Moons</span>

                        <span>1</span>

                    </div>

                    <div className="flex justify-between">

                        <span>Population</span>

                        <span>8 Billion</span>

                    </div>

                </div>

            </div>

        </div>

    );

}