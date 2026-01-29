const BackgroundAnimation = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-[20%] left-0 w-full h-[2px] bg-linear-to-r from-transparent via-white/20 to-transparent animate-scan-fast" />
      <div
        className="absolute top-[60%] left-0 w-full h-[2px] bg-linear-to-r from-transparent via-white/10 to-transparent animate-scan-slow"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-0 right-[20%] w-[2px] h-full bg-linear-to-b from-transparent via-white/15 to-transparent animate-drop-fast"
        style={{ animationDelay: "0.5s" }}
      />
      <div
        className="absolute top-0 left-[30%] w-[2px] h-full bg-linear-to-b from-transparent via-white/10 to-transparent animate-drop-medium"
        style={{ animationDelay: "2s" }}
      />
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,var(--app-bg)_100%] opacity-60" />
    </div>
  );
};

export default BackgroundAnimation;
