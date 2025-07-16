import { cn } from "@/utilities/cn";
import React, { ComponentProps, forwardRef } from "react";

interface IInput extends ComponentProps<"input"> {
  varient?: string;
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

const Input = forwardRef<HTMLInputElement, IInput>(
  ({ className, varient = "gray", Icon, ...rest }, ref) => {
    return (
      <div className="relative flex w-full flex-col">
        <input
          ref={ref}
          className={cn(
            "peer rounded-lg border border-gray-300 px-3 py-[0.6rem] pl-8 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-gray-700 focus:ring-offset-1 focus:outline-0",
            { "text-green-800": varient === "green" },
            className,
          )}
          {...rest}
        />
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex flex-col items-center justify-center px-2 peer-focus:text-gray-700">
            <Icon />
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
