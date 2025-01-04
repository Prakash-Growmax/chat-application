const LogoIcon = ({ className }: { className: string }) => {
  return (
    <div
      className={className}
      style={{
        width: "20px", // Explicitly set container size
        height: "20px", // Explicitly set container size
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="100%" // Make SVG scale to container
        height="100%" // Make SVG scale to container
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M205.554 115.512L358.885 384.939L205.554 304.058L50 384.939L205.554 115.512Z"
          fill="#9855FF"
        />
        <path
          d="M205.17 115L450 244.618L359.007 268.867L358.781 384.793L205.17 115Z"
          fill="#823BEF"
        />
      </svg>
    </div>
  );
};

export default LogoIcon;
