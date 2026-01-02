import { Link } from "@tanstack/react-router";
import React, { type ReactNode } from "react";

interface PaginationLinkProps {
  to: string;
  element: ReactNode;
}

export const PaginationLink = ({ to, element }: PaginationLinkProps) => {
  return (
    <Link
      to={to}
    >
      {element}
    </Link>
  );
};
