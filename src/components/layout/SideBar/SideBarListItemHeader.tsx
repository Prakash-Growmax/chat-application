import LucideIcon from "@/components/Custom-UI/LucideIcon";
import { ListItemHeaderText } from "@/Theme/Typography";
import { Divider } from "@mui/material";

function SideBarListItemHeader({
  icon,
  title,
}: {
  icon: string;
  title: string;
}) {
  return (
    <>
      <div className="my-2 flex items-center gap-2">
        <LucideIcon name={icon} size={15} />
        <ListItemHeaderText>{title}</ListItemHeaderText>
      </div>
      <Divider />
    </>
  );
}

export default SideBarListItemHeader;
