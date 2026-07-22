import { useState } from "react";
import { Link } from "react-router-dom";
import { useSmoothScroll } from "../Data/useSmoothScroll";

type DashboardAccordionProps = {
  title: string;
  preview: string;
  expandedView: string[];
  pagePath: string;
};

export default function DashboardAccordion({
  title,
  preview,
  expandedView,
  pagePath,
}: DashboardAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const smoothScroll = useSmoothScroll();

  return (
    <div className="glass-panel accordion-card">
      <h3 onClick={() => setIsOpen(!isOpen)}>{title}</h3>
      <p>{preview}</p>

      <div className={`accordion-body ${isOpen ? "open" : ""} ${smoothScroll ? "" : "no-motion"}`}>
        <div className="accordion-body-inner">
          {expandedView.map((line, index) => (
            <p key={index} className="expanded-line">{line}</p>
          ))}
          <Link to={pagePath}>
            <button className="open-btn">Open Activity</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
