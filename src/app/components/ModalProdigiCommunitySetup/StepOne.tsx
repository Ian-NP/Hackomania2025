import { Globe } from 'lucide-react';

export const ModalStep1 = () => {
  return (
    <div className="bg-gray-50 rounded-lg border p-5">
      <div className="flex items-start space-x-4">
        <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
          <Globe className="h-5 w-5 text-green-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-2">Step 1: Join Communities</h2>
          <p className="text-gray-600 mb-4">Select communities that match your interests.</p>
          <div className="space-y-3">
            {/* Repeatable community options */}
            <div className="border rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Technology</h3>
                    <p className="text-sm text-gray-500">Coding, web dev, and more</p>
                  </div>
                </div>
                <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  Joined
                </button>
              </div>
            </div>
            <div className="border rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Globe className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Academics</h3>
                    <p className="text-sm text-gray-500">Study groups, help, and resources</p>
                  </div>
                </div>
                <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  Joined
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalStep1;