import React, { ReactNode } from "react";

interface SectionProps {
  transition: string;
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ transition, children }) =>
  <section data-transition={transition}>
    {children}
  </section>;

export default Section;
