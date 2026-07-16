import { useState } from "react";
import { useSmoothScroll } from "../Data/useSmoothScroll";

type AccordianPreviewProps = {
  title: string;
  content: string;
  previewMode: "first" | "last";
};

export default function AccordionPreview({
  title,
  content,
  previewMode,
}: AccordianPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const smoothScroll = useSmoothScroll();

  const lines = content.split("\n");
  const previewLines =
    previewMode === "first" ? lines.slice(0, 3) : lines.slice(-3);

  return (
    <div
      className="glass-panel accordion-card"
      onClick={() => setIsOpen(!isOpen)}
    >
      <h3>{title}</h3>

      {/* Collapsed preview (first/last few lines) fades out as the full
          content opens, rather than the two swapping instantly. */}
      <div className={`accordion-body ${isOpen ? "" : "open"} ${smoothScroll ? "" : "no-motion"}`}>
        <div className="accordion-body-inner">
          {previewLines.map((line, index) => (
            <p key={index} className="expanded-line">{line}</p>
          ))}
        </div>
      </div>

      <div className={`accordion-body ${isOpen ? "open" : ""} ${smoothScroll ? "" : "no-motion"}`}>
        <div className="accordion-body-inner">
          {lines.map((line, index) => (
            <p key={index} className="expanded-line">{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
