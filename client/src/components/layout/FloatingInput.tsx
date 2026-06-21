import React, { useState } from "react";

type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "textarea"
  | "boolean"
  | string;

interface FloatingInputProps {
  label: string;
  name: string;
  type?: InputType;
  value: string | boolean;
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: boolean } },
  ) => void;
  icon?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon,
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  const isActive =
    focused ||
    (type === "boolean"
      ? value === true || value === false
      : typeof value === "string" && value.length > 0);

  return (
    <div className="relative w-full">
      <label
        className={`
          absolute left-0 transition-all text-base-content font-poppins duration-300 font-semibold
          ${isActive ? "-top-1 md:-top-2 text-xs md:text-sm" : "top-0 md:top-1 text-sm md:text-base"}
        `}
      >
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          name={name}
          value={value as string}
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={4}
          className="w-full bg-transparent font-mona font-medium text-base-content text-base border-b-2 border-base-content pb-2 pt-5 outline-none transition-all duration-300 pr-10 resize-none"
        />
      ) : type === "boolean" ? (
        <input
          type="checkbox"
          name={name}
          checked={value as boolean}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ target: { name, value: e.target.checked } })
          }
          className="
            mt-6 w-5 h-5 cursor-pointer accent-base-content
          "
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value as string}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent font-mona font-medium text-base-content text-sm md:text-base border-b-2 border-base-content pb-2 pt-5 outline-none transition-all duration-300 pr-10"
        />
      )}

      {icon && type !== "boolean" && (
        <img
          src={icon}
          alt="icon"
          className="absolute right-1 bottom-3 w-5 md:w-7 h-auto"
        />
      )}
    </div>
  );
};

export default FloatingInput;
