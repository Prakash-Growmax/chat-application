import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  Building2,
  CreditCard,
  Bell,
  HelpCircle,
  Users,
  ChevronDown,
  MessageCirclePlus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useContext, useState } from 'react';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { IconButton } from "@mui/material";
import {MenuIcon} from "lucide-react";

import AppContext from '../context/AppContext';
import Sidebar from '../ui/sidebar';
import ChatControl from '../ui/chat-control';
const primaryNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Organizations', href: '/organizations', icon: Building2 },
  { label: 'Plans', href: '/plans', icon: CreditCard },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Header() {
  const { user, signOut } = useAuth();
  const location = useLocation();
     const navigator = useNavigate();
  const {open,setOpen,openRight,setOpenRight,state,setState}=useContext(AppContext);
  const handleDrawerOpen = () =>{
    setOpen(true)
  }
  const handleDrawerClose = () =>{
    setOpen(false)
  }
  const handleChatControl=()=>{
    setOpenRight(!openRight)
   }
   function createNewChat() {
    setState({
      messages: [],
      isLoading: false,
      csvData: null,
      error: null,
      s3Key: null,
    });
    navigator("/dashboard");
    setOpen(false)
  }
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
         
          {user && ( <div className='flex'>
               {open ? (<IconButton
  size="large"
  edge="start"
  aria-label="menu"
  onClick={handleDrawerClose}
  disableRipple // Removes ripple effect
  disableFocusRipple // Removes focus ripple
  sx={{
    mr: 2,
    color: 'black',
    '&:focus': { outline: 'none' }, // Removes focus outline
    '&:active': { outline: 'none' }, // Removes outline on click
    
  }}
>
  <MenuOpenIcon style={{ color: 'black'}} />
</IconButton>) : ( <IconButton
          size="large"
          edge="start"
          aria-label="menu"
          onClick={handleDrawerOpen}
          disableFocusRipple // Removes focus ripple
          sx={{
            mr: 2,
            color: 'black',
            '&:focus': { outline: 'none' }, // Removes focus outline
            '&:active': { outline: 'none' }, // Removes outline on click
          }}
          >
  <MenuIcon style={{ color: 'black' }} /> {/* Ensures the MenuIcon is white */}
</IconButton>)}
              </div>)}
       
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 -ml-12"/>
            <span className="lg:text-xl  text-sm font-bold">CSV Insight AI</span>
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
                          'flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors hover:bg-gray-100',
                          location.pathname === item.href
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600'
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
                {user.tokenUsage.toLocaleString()} tokens used
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
                    {user.plan !== 'single' && (
                      <DropdownMenuItem asChild>
                        <Link to="/organizations" className="w-full">
                          <Users className="mr-2 h-4 w-4" />
                          Organizations
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/notifications" className="w-full">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/support" className="w-full">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
                    </Link>
                  </DropdownMenuItem>
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
          {user && (
          <>
              <div className='flex' onClick={handleChatControl}>
            <ChatControl/>
            </div>
            <div className='flex' onClick={createNewChat}>
            <MessageCirclePlus
            className="cursor-pointer w-5 h-5 text-black ml-4"
          
          />
            </div>
          </>
          
            
          
          )}
        </div>
        
      </div>
      <Sidebar open={open} setOpen={setOpen} createNewChat={createNewChat}/>
    </header>
  );
}