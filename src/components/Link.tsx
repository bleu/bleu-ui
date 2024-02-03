import { Link as RRDLink, type LinkProps } from "react-router-dom";
import React from "react";

export function Link({ to, children, ...props }: LinkProps) {
  return (
    <RRDLink to={to} unstable_viewTransition {...props}>
      {children}
    </RRDLink>
  );
}
