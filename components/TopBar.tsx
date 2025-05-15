import Link from 'next/link';

interface TopBarProps {
  title: string;
  pageName: string;
}

const TopBar = ({ title, pageName }: TopBarProps) => {
  return (
    <div className="bg-[#111d42] text-white py-16 relative overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-5xl font-bold mb-2">{title}</h1>
        <div className="flex items-center justify-center space-x-2">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>||</span>
          <span>{pageName}</span>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute left-10 top-1/2 transform -translate-y-1/2">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="15" cy="15" r="15" fill="#FF5722" fillOpacity="0.8" />
          <circle cx="15" cy="45" r="10" fill="#FF5722" fillOpacity="0.6" />
          <circle cx="45" cy="15" r="10" fill="#FF5722" fillOpacity="0.6" />
          <circle cx="45" cy="45" r="5" fill="#FF5722" fillOpacity="0.4" />
        </svg>
      </div>
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 0L60 30L30 60L0 30L30 0Z"
            fill="#8B5CF6"
            fillOpacity="0.5"
          />
        </svg>
      </div>
      <div className="absolute left-1/4 bottom-0">
        <svg
          width="120"
          height="20"
          viewBox="0 0 120 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 10C20 0 40 20 60 10C80 0 100 20 120 10"
            stroke="#4F46E5"
            strokeOpacity="0.3"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};

export default TopBar;
