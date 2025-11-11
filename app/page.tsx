export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4">
      <div className="text-center max-w-4xl">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Resume Generator
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Generate customized resumes powered by Google Gemini AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">
              🎯 Smart Customization
            </h3>
            <p className="text-gray-300 text-sm">
              AI analyzes job descriptions and selects your most relevant experience
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-purple-400">
              ⚡ Instant Generation
            </h3>
            <p className="text-gray-300 text-sm">
              Generate professional Word docs in seconds with perfect formatting
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-green-400">
              🤖 BAML Powered
            </h3>
            <p className="text-gray-300 text-sm">
              Uses cutting-edge AI technology for intelligent content selection
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-yellow-400">
              📊 MongoDB Backend
            </h3>
            <p className="text-gray-300 text-sm">
              Flexible data storage with efficient querying and indexing
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <a
            href="/resume-generator"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Generate Resume →
          </a>
          <div className="text-sm text-gray-400">
            <p>No signup required • Free to use • Professional results</p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-500 mb-4">Built with</p>
          <div className="flex flex-wrap justify-center gap-4 text-gray-400 text-sm">
            <span>Next.js 14</span>
            <span>•</span>
            <span>TypeScript</span>
            <span>•</span>
            <span>BAML</span>
            <span>•</span>
            <span>Gemini AI</span>
            <span>•</span>
            <span>MongoDB</span>
            <span>•</span>
            <span>docxtemplater</span>
          </div>
        </div>
      </div>
    </div>
  );
}
