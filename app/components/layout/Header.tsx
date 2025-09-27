export default function Header() {
  return (
    <header className="text-center py-6">
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <span className="text-xl font-bold">₿</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Easy Crypto
        </h1>
      </div>
      <p className="text-lg text-gray-300 font-medium">Tests Panel - Notus API (Track A)</p>
    </header>
  );
}
