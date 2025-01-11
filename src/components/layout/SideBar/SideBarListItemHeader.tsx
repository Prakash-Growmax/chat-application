import { ListItemHeaderText } from "@/Theme/Typography";
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
      <div className="my-2 flex items-center gap-2">
        <Icon size={12} />
        <ListItemHeaderText>{title}</ListItemHeaderText>
      </div>
      <Divider />
    </>
  );
}

export default SideBarListItemHeader;
