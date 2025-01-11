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
      <div className="mb-1.5 mt-3.5 flex items-center gap-2">
        <Icon size={20}/>
        <ListItemHeaderText>{title}</ListItemHeaderText>
      </div>
      <Divider />
    </>
  );
}

export default SideBarListItemHeader;
