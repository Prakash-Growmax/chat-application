import { loadIcon } from "@/utils/icons.utils";
import { Suspense, useEffect, useState } from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  // Extend SVGProps for icon props
  name: keyof typeof import("lucide-react"); // Type for the icon name
  [key: string]: any;
}

function Icon({ name, ...props }: IconProps) {
  const [IconComponent, setIconComponent] = useState<React.FC<
    React.SVGProps<SVGSVGElement>
  > | null>(null);

  useEffect(() => {
    loadIcon(name).then((icon) => {
      setIconComponent(() => icon); // Set the icon component
    });
  }, [name]);

  if (!IconComponent) return <div className={props.className} />; // Fallback

  return <IconComponent {...props} />;
}

export default function LucideIcon({ name, ...props }: IconProps) {
  return (
    <Suspense fallback={<div className={`${props.className} h-5 w-5`} />}>
      <Icon name={name} {...props} />
    </Suspense>
  );
}
