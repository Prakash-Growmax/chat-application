import { Divider } from "@mui/material";

function SideBarListItemHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <>
      <label className="mb-1.5 text-sm font-medium mt-3.5 flex flex-row items-center gap-0.5">
        <div className="">
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-inter font-medium lg:text-base md:text-lg text-lg text-custom-color">
          {title}
        </span>
      </label>
      <Divider />
    </>
  );
}

export default SideBarListItemHeader;
