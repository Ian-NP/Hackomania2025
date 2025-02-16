"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ModalStep1 } from "../../components/ModalProdigiCommunitySetup/StepOne";
import { ModalStep2 } from "../../components/ModalProdigiCommunitySetup/StepTwo";
import { ModalStep3 } from "../../components/ModalProdigiCommunitySetup/StepThree";
import { DontShowAgainCheckbox } from "../../components/ModalProdigiCommunitySetup/DontShowAgainCheckbox";
// import { CompleteSetupButton } from './CompleteSetupButton';

const ModalProdigiCommunitySetup = ({ onClose }: { onClose: () => void }) => {
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check sessionStorage for the 'dontShowAgain' preference
    const storedPreference = sessionStorage.getItem("dontShowModal");
    if (storedPreference === "true") {
      onClose(); // Close modal immediately if the user has previously chosen "Don't show this again"
    }
  }, [onClose]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDontShowAgain(e.target.checked);
  };

  const handleCompleteSetup = () => {
    if (dontShowAgain) {
      sessionStorage.setItem("dontShowModal", "true");
    }

    router.push("/findPods");

    onClose();
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="overflow-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-3">
              Welcome to Your Communities!
            </h1>
            <p className="text-gray-600">
              Let's get you set up for success. Complete these steps to make the
              most of your communities.
            </p>
          </div>

          <div className="space-y-5">
            <ModalStep1 />
            <ModalStep2 />
            <ModalStep3 />
          </div>

          <DontShowAgainCheckbox
            checked={dontShowAgain}
            onChange={handleCheckboxChange}
          />
          {/* Complete Setup Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleCompleteSetup}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Complete Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalProdigiCommunitySetup;
