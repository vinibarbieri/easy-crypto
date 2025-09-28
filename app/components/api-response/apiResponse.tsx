interface ApiResponseProps {
  isLoading: boolean;
  error: string;
  responseJson: unknown;
  apiCalled: string;
}

export default function ApiResponse({ isLoading, error, responseJson, apiCalled }: ApiResponseProps) {
  return (
    <section className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-2xl border border-gray-600 shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">📡</span>
        </div>
        <h2 className="text-xl font-bold">Notus API Response</h2>
      </div>
      
      {apiCalled && (
        <div className="mb-4 p-3 bg-gray-900 rounded-lg border border-gray-600">
          <span className="text-sm text-gray-400">Endpoint:</span>
          <span className="text-sm text-blue-300 font-mono ml-2">{apiCalled}</span>
        </div>
      )}
      
      <div className="min-h-[200px] flex bg-gray-900 rounded-xl border border-gray-600 p-4 scrollbar-thin overflow-y-auto">
        {error ? (
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-red-400">❌</span>
              <span className="text-red-400 font-semibold">Error</span>
            </div>
            <pre className="text-red-300 text-sm whitespace-pre-wrap bg-red-900/20 p-4 rounded-lg border border-red-800">
              {error}
            </pre>
          </div>
        ) : responseJson ? (
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-400">✅</span>
              <span className="text-green-400 font-semibold">Success</span>
            </div>
            <pre className="text-green-300 text-sm whitespace-pre-wrap bg-green-900/20 p-4 rounded-lg border border-green-800 overflow-x-auto">
              {JSON.stringify(responseJson, null, 2)}
            </pre>
          </div>
        ) : (
          isLoading ? (
          <div className="flex items-center justify-center gap-2 w-full">
            <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
            <span className="text-yellow-400 font-medium">Processing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📋</div>
              <p>No response yet</p>
              <p className="text-sm">Execute an action to see the API response</p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
