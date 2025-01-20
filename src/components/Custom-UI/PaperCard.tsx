import { ReactNode } from "react";

const PaperCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={
        "bg-gray-50 shadow w-full border-none rounded-3xl p-3 " + className
      }
    >
      {children}
    </div>
  );
};

export default PaperCard;
