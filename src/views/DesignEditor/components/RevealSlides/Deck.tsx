import { useEffect } from "react";
import revealOptions from "./revealOptions";
import Reveal from "reveal.js";
import PropTypes, { object } from "prop-types";
import "./Notes";
import "./Css/Reveal.css";

interface DeckProps {
  children: React.ReactNode;
}
const addClass = (CurrentSlideRef: HTMLElement): void => {
  for (let i = 0; i < CurrentSlideRef.children.length; i += 1) {
    CurrentSlideRef.children[i].classList.add("resize");
  }
};

const Deck: React.FC<DeckProps> = ({ revealOptions, children }) => {
  useEffect(() => {
    console.log("abc");
    Reveal.initialize({ ...revealOptions });
  }, []);

  useEffect(() => {
    const initRef = Reveal.getSlides()[0] as HTMLElement;
    addClass(initRef);
  }, []);

  useEffect(() => {
    const slideChangedHandler = (event: any): void => {
      const currentSlide = event.currentSlide as HTMLElement;
      addClass(currentSlide);
    };

    Reveal.addEventListener("slidechanged", slideChangedHandler);

    return () => {
      Reveal.removeEventListener("slidechanged", slideChangedHandler);
    };
  }, []);

  return (
    <div className="reveal">
      <div className="slides">
        {children}
      </div>
    </div>
  );
};

interface DeckProps {
  revealOptions: object;
  children: React.ReactNode;
}

export default Deck;
