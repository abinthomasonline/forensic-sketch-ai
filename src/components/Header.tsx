export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900">Forensic Sketch AI</h1>
        <h2 className="text-xl font-bold text-gray-700">Face → Text → Face</h2>
        <p className="mt-2 text-gray-600">
        Turn a face into a forensic facial description and regenerate it back into a sketch. A simple experiment studying information loss across modalities (vision → language → vision).
        </p>
      </div>
    </header>
  )
}
