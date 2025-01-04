import { ReactNode } from "react";

const PaperCard = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  return <div className={"bg-gray-50 shadow " + className}>{children}</div>;
};

export default PaperCard;
