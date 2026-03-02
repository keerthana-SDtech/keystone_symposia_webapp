import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../app/providers/useAuthContext";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useTenant } from "../../app/providers/TenantProvider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const Header = () => {
    const { name, logo, logoWidth, logoHeight } = useTenant();
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="flex justify-between items-center px-8 lg:px-12 py-[18px] bg-[#4a4a4a] sticky top-0 z-50 w-full shrink-0">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
                <img src={logo} alt={name} style={{ width: logoWidth, height: logoHeight }} className="object-contain" />
            </div>

            <div className="flex items-center">
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-3 cursor-pointer group">
                                <span className="hidden sm:inline-block text-[#e5e7eb] font-medium text-[14.5px] group-hover:text-white transition-colors">
                                    Welcome, {user.name}
                                </span>
                                <Avatar className="h-9 w-9 border border-gray-500 bg-primary">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt={user.name} />
                                    <AvatarFallback className="bg-primary/20 text-white select-none">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-gray-100 shadow-xl">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-bold leading-none text-gray-900">{user.name}</p>
                                    <p className="text-xs leading-none text-gray-500 italic">{user.role.replace('_', ' ')}</p>
                                    <p className="text-xs leading-none text-gray-400 truncate">{user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-gray-50" />
                            <DropdownMenuItem
                                onClick={() => navigate("/dashboard")}
                                className="cursor-pointer py-2.5 text-gray-600 focus:bg-primary/10 focus:text-primary rounded-lg mx-1"
                            >
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-50" />
                            <DropdownMenuItem
                                onClick={handleLogout}
                                className="cursor-pointer py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700 rounded-lg mx-1"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="text-[#e5e7eb] font-medium text-[14.5px] cursor-pointer hover:text-white transition-colors" onClick={() => navigate("/login")}>
                        Login
                    </div>
                )}
            </div>
        </header>
    );
};
