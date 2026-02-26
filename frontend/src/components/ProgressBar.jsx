const ProgressBar = ({ percentage = 0 }) => {
  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-3 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-1">{percentage}% complete</p>
    </div>
  );
};

export default ProgressBar;