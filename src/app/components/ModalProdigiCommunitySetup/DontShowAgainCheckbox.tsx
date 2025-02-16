export const DontShowAgainCheckbox = ({ checked, onChange }: { checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return (
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="mr-2"
        />
        <span className="text-sm text-gray-600">Don't show this again</span>
      </div>
    );
  };
  