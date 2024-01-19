import React from "react";

type SectionTitleProps = {
  children: React.ReactNode;
};

export const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => (
  <h2 className="pt-8 text-2xl font-bold tracking-tigh text-foreground">
    {children}
  </h2>
);
