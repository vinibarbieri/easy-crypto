export default function Header() {
  return (
    <header className="text-center py-8">
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <span className="text-2xl font-bold">₿</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Easy Crypto
        </h1>
      </div>
      <p className="text-xl text-gray-300 font-medium">Tests Panel - Notus API (Track A)</p>
      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-300">System Online</span>
      </div>
    </header>
  );
}
