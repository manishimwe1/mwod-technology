"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { User2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const UserButton = () => {
  const user = useSession();

  const username = useQuery(api.users.getUserIndb, {
    email: user.data?.user.email!,
  });
  // console.log(username?.firstname,user?.data?.user.name);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {username ? (
          <div className="h-8 w-8 rounded-full bg-indigo-400 flex items-center justify-center shadow hover:bg-gradient-to-bl from-indigo-500 via-35% to-indigo-400 cursor-pointer">
            <p className="text-white">
              {username.fullname.charAt(0).toUpperCase()}
            </p>
          </div>
        ) : (
          <User2 className="h-6 w-6" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col items-center py-4">
          <div className="h-12 w-12 rounded-full bg-indigo-400 flex items-center justify-center mb-2">
            <p className="text-white text-lg">
              {username?.fullname?.charAt(0).toUpperCase()}
            </p>
          </div>
          <div className="font-semibold text-indigo-900">
            {username?.fullname}
          </div>
          <div className="text-xs text-gray-500">{username?.email}</div>
          <div className="text-xs text-gray-500">Role: {username?.role}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            signOut({
              redirectTo: "/login",
            })
          }
          className="text-red-600 cursor-pointer"
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
