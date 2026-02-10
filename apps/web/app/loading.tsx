export default function GlobalLoading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                {/* Nike swoosh spinner */}
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-2 border-black/5" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-black animate-spin" />
                </div>
                <p className="text-sm text-black/30 font-medium">Loading...</p>
            </div>
        </div>
    );
}
