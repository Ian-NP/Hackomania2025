import { Trophy } from 'lucide-react';

export const ModalStep2 = () => {
  return (
    <div className="bg-gray-50 rounded-lg border p-5">
      <div className="flex items-start space-x-4">
        <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
          <Trophy className="h-5 w-5 text-green-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-2">Step 2: Set Your Learning Goals</h2>
          <p className="text-gray-600 mb-4">Define your targets and milestones.</p>
          <div className="space-y-4">
            <div className="border rounded-lg p-3 bg-white">
              <h3 className="font-medium mb-2">Technology Goals</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1">Daily focus time target</label>
                  <select className="w-full border rounded-lg p-2 text-sm">
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>3 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">First milestone</label>
                  <select className="w-full border rounded-lg p-2 text-sm">
                    <option>Complete HTML basics</option>
                    <option>Build first webpage</option>
                    <option>Learn JavaScript fundamentals</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-3 bg-white">
              <h3 className="font-medium mb-2">Academics Goals</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm mb-1">Study time target</label>
                  <select className="w-full border rounded-lg p-2 text-sm">
                    <option>2 hours</option>
                    <option>3 hours</option>
                    <option>4 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Focus area</label>
                  <select className="w-full border rounded-lg p-2 text-sm">
                    <option>Improve study habits</option>
                    <option>Exam preparation</option>
                    <option>Assignment planning</option>
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

export default ModalStep2;