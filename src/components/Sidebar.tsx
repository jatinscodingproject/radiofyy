import {
    Home,
    Globe,
    Plus,
    Minus,
    RotateCcw
} from "lucide-react";

const buttons = [
    Home,
    Globe,
    Plus,
    Minus,
    RotateCcw
];

export default function Sidebar() {
    return (
        <div className="absolute left-5 top-40 z-40">
            <div className="rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-3 space-y-4">
                {buttons.map((Icon, index) => (
                    <button
                        key={index}
                        className="flex h-14 w-14 items-center justify-center rounded-xl text-white hover:bg-blue-600 transition">
                        <Icon />
                    </button>
                ))}
            </div>
        </div>
    );
}