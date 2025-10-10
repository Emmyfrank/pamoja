import "./Loader.css";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200">
      <div className="flex text-6xl font-bold text-pamoja-purple items-center space-x-2">
        <span className="bounce delay-0">P</span>
        <span className="bounce delay-1">A</span>
        <span className="bounce delay-2">M</span>
        <span className="bounce delay-3">O</span>
        <span className="bounce delay-0">J</span>
        <span className="bounce delay-1">A</span>
      </div>
      <div className="flex text-6xl font-bold text-pamoja-purple  items-center space-x-8">
        <span className="dot delay-0">•</span>
        <span className="dot delay-1">•</span>
        <span className="dot delay-2">•</span>
        <span className="dot delay-3">•</span>
        <span className="dot delay-0">•</span>
        <span className="dot delay-1">•</span>
      </div>
    </div>
  );
};

export default Loader;
