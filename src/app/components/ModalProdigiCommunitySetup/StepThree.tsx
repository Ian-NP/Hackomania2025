import { Users } from 'lucide-react';

export const ModalStep3 = () => {
  return (
    <div className="bg-gray-50 rounded-lg border p-5">
      <div className="flex items-start space-x-4">
        <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
          <Users className="h-5 w-5 text-green-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-2">Step 3: Connect with Others</h2>
          <p className="text-gray-600 mb-4">Find study buddies and mentors.</p>
          <div className="space-y-4">
            <div className="border rounded-lg p-3 bg-white">
              <h3 className="font-medium mb-2">Join Pods (small groups)</h3>
              <p className="text-sm text-gray-600 mb-3">Select your preferences for finding the perfect pod:</p>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1">Preferred pod size</label>
                  <select className="w-full border rounded-lg p-2 text-sm">
                    <option>3-5 members</option>
                    <option>6-8 members</option>
                    <option>9-12 members</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Meeting frequency</label>
                  <select className="w-full border rounded-lg p-2 text-sm">
                    <option>Daily check-ins</option>
                    <option>Weekly sessions</option>
                    <option>Bi-weekly meetings</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Experience level</label>
                  <select className="w-full border rounded-lg p-2 text-sm">
                    <option>Beginner friendly</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalStep3;