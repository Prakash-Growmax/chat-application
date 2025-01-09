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
      <div className="mb-1.5 mt-3.5 flex items-center gap-2">
        <Icon />
        <span className=" font-[600] text-[12.5px] text-custom-color">
          {title}
        </span>
      </div>
      <Divider />
    </>
  );
}

export default SideBarListItemHeader;
