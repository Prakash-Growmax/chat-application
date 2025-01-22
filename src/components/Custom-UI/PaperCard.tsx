import { ReactNode } from "react";

const PaperCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`bg-gray-50 w-full rounded-3xl shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default PaperCard;
