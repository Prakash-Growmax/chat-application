import loaderGif from "@/assets/Logo/loader.gif";

const LogoLoader = ({ alt = "Loading...", className = "" }) => {
  return (
    <div className="flex items-center justify-center">
      {/* Replace the placeholder with your GIF path */}
      <img
        src={loaderGif} // Replace this with your GIF path like: "/path/to/your/loader.gif"
        alt={alt}
        className={`w-12 h-12 object-contain ${className}`} // Adjust size as needed
      />
    </div>
  );
};

export default LogoLoader;
