interface Props {
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const Button = ({ text, icon, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center group rounded-full text-sm md:text-base"
    >
      <div className="relative flex items-center space-x-2 rounded-full bg-orange-600 px-4 py-2 md:px-6 md:py-2.5 transition-all duration-300 hover:bg-transparent border border-transparent hover:border-orange-600">
        {icon && (
          <span className="text-white group-hover:text-orange-600">{icon}</span>
        )}
        <span className="text-white group-hover:text-orange-600 font-semibold">
          {text}
        </span>
        <svg
          className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-orange-600 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.75 8.75L14.25 12L10.75 15.25"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-[90%] bg-gradient-to-r from-transparent via-orange-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default Button;
