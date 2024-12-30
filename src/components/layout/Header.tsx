import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useTokenUsage } from "@/hooks/useTokenUsage";
import { cn } from "@/lib/utils";
import { Avatar, IconButton, useMediaQuery, useTheme } from "@mui/material";

import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import {
  Building2,
  ChevronDown,
  CreditCard,
  Layout,
  LayoutDashboard,
  LogOut,
  Menu,
  MenuIcon,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useContext } from "react";

import { Link, useLocation } from "react-router-dom";
import AppContext from "../context/AppContext";
import Sidebar from "../ui/sidebar";
const primaryNavItems = [
  { label: "Chat", href: "/chat", icon: LayoutDashboard },
  { label: "Team", href: "/teams", icon: Building2 },
  { label: "Plans", href: "/plans", icon: CreditCard },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Header() {
  const { user, signOut } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTab = useMediaQuery(theme.breakpoints.down("md"));
  const { data: tokens } = useTokenUsage();
  const location = useLocation();
  const { open, setOpen, createNewChat } = useContext(AppContext);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <header className="flex items-center justify-between px-4 py-4  bg-white">
      {/* Left section */}
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <Menu size={25} className="text-gray-800" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-md">
          <Layout size={25} className="text-gray-800" />
        </button>
        <div className="flex items-center space-x-2">
          <span className="font-bold text-lg text-gray-800">ChatGPT</span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8  rounded-full flex items-center justify-center cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar alt="Menu" size={30} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/plans" className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Plans & Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/teams" className="w-full">
                      <Users className="mr-2 h-4 w-4" />
                      Teams
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <div>
            {(isMobile || isTab) &&
              user &&
              (open ? (
                <IconButton
                  size="large"
                  edge="start"
                  aria-label="menu"
                  onClick={handleDrawerClose}
                  disableFocusRipple
                  sx={{
                    mr: 2,
                    color: "black",
                    "&:focus": { outline: "none" },
                    "&:active": { outline: "none" },
                  }}
                >
                  <MenuOpenIcon style={{ color: "black" }} />{" "}
                  {/* Ensures the MenuIcon is white */}
                </IconButton>
              ) : (
                <IconButton
                  size="large"
                  edge="start"
                  aria-label="menu"
                  onClick={handleDrawerOpen}
                  disableFocusRipple
                  sx={{
                    mr: 2,
                    color: "black",
                    "&:focus": { outline: "none" },
                    "&:active": { outline: "none" },
                  }}
                >
                  <MenuIcon style={{ color: "black" }} />{" "}
                </IconButton>
              ))}
          </div>

          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <span className="lg:text-xl  text-sm font-bold">
              CSV Insight AI
            </span>
          </Link>

          {user && (
            <>
              <nav className="hidden lg:flex">
                <ul className="flex items-center gap-1">
                  {primaryNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          className={cn(
                            "flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors hover:bg-gray-100",
                            location.pathname === item.href
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden text-sm text-gray-600 md:block">
                {tokens?.tokens_remaining?.toLocaleString()} tokens left
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden md:inline-block">Account</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/plans" className="w-full">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Plans & Billing
                      </Link>
                    </DropdownMenuItem>
                    {user.plan !== "single" && (
                      <DropdownMenuItem asChild>
                        <Link to="/teams" className="w-full">
                          <Users className="mr-2 h-4 w-4" />
                          Teams
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
      {(isMobile || isTab) && (
        <Sidebar open={open} setOpen={setOpen} createNewChat={createNewChat} />
      )}
    </header>
  );
}
