import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  noLabel?: boolean;
  noBtmMargin?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label = "Input", error, name, noLabel, noBtmMargin, ...rest }, ref) => {
    const inputName = name ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`flex flex-col gap-1 `}>
        {!noLabel && label && (
          <label className=" text-sm font-semibold">{label}</label>
        )}
        <div>
          <div className="flex flex-row gap-2 px-2 py-1 bg-input-background rounded-lg focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary">
            <input
              ref={ref}
              name={inputName}
              className="w-full text-sm bg-input-background p-1 focus:outline-none"
              {...rest}
            />
          </div>
          <div className="h-4 pt-1">
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
