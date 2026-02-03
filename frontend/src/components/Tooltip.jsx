const Tooltip = ({ text, children }) => (
  <div className="relative group flex items-center justify-center">
    {children}

    {/* Tooltip box */}
    <span
      className="
        absolute bottom-8 
        left-1/2 -translate-x-1/2 
        px-3 py-1 
        rounded-lg 
        bg-white/30 
        backdrop-blur-md 
        text-gray-900 
        text-xs font-medium 
        whitespace-nowrap 
        opacity-0 
        group-hover:opacity-100 
        group-hover:translate-y-1 
        transition-all 
        shadow-lg 
        border border-white/40
      "
    >
      {text}

      {/* Arrow */}
      <span
        className="
          absolute left-1/2 -translate-x-1/2 
          top-full 
          w-2 h-2 
          bg-white/30 
          backdrop-blur-md 
          border-r border-b border-white/40 
          rotate-45
        "
      ></span>
    </span>
  </div>
);
export default Tooltip;