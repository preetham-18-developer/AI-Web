

export const TrustBar = () => {
  const items = [
    "Instagram Reels",
    "YouTube Shorts",
    "AI Editing",
    "Color Grading",
    "Motion Graphics",
    "Fast Turnaround",
    "500+ Videos Edited"
  ];

  return (
    <div className="w-full h-[72px] bg-surface border-y border-border overflow-hidden flex items-center relative group">
      <div className="flex w-fit animate-[marquee_20s_linear_infinite] group-hover:[animation-play-state:paused]">
        {/* Duplicate list for seamless loop */}
        {[...items, ...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center flex-shrink-0">
            <span className="font-body text-[13px] text-text-muted uppercase tracking-[0.1em] whitespace-nowrap mx-8">
              {item}
            </span>
            <span className="text-accent text-[13px]">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
