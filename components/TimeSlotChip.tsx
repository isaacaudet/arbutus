"use client";

interface TimeSlotChipProps {
  start: Date;
  bookingUrl: string;
  isToday: boolean;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Vancouver",
  });
}

export function TimeSlotChip({ start, bookingUrl, isToday }: TimeSlotChipProps) {
  const handleClick = () => {
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium
        border transition-all duration-150 cursor-pointer active:scale-95
        ${
          isToday
            ? "bg-coral/8 border-coral/25 text-coral hover:bg-coral/15 hover:border-coral/40 hover:shadow-sm"
            : "bg-sage/8 border-sage/25 text-brand hover:bg-sage/15 hover:border-sage/40 hover:shadow-sm"
        }
      `}
    >
      {formatTime(start)}
    </button>
  );
}
