import React from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { ArrowLongLeft } from "@medusajs/icons";

type Props = {
  path?: string;
  label?: string;
  className?: string;
};

const BackButton = ({ path, label, className }: Props) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        path ? navigate(path) : navigate(-1);
      }}
      className={clsx("px-small py-xsmall", className)}
    >
      <div className="flex items-center text-sm text-gray-500">
        <ArrowLongLeft/>
        <span className="ml-2">{label ?? "Go back"}</span>
      </div>
    </button>
  );
};

export default BackButton;
