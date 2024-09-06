"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ArrowDownNarrowWide,
  LogOut,
  Menu,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "./ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";
import { User } from "@/models/User";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  {
    label: "Pacientes",
    href: "/patients",
  },
  {
    label: "Doutores",
    href: "/doctors",
  },
  {
    label: "Consultas",
    href: "/appointments",
  },
];

const MobileNavigation = ({ currentPath }: { currentPath: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <div className="inline-flex items-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-md h-9 px-3 py-2">
          <Menu className="size-4" />
        </div>
      </SheetTrigger>
      <SheetContent side={"left"} className="space-y-2">
        <SheetHeader>
          <SheetTitle>Navegação</SheetTitle>
          <SheetDescription>
            Navegue entre as páginas da aplicação
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col justify-between h-[90%]">
          <ul className="space-y-2">
            {navItems.map((e, i) => (
              <li key={i} className="w-full">
                <Button
                  variant={currentPath === e.href ? "default" : "ghost"}
                  className="w-full py-0"
                  onClick={() => setOpen(false)}
                >
                  <Link href={e.href} className="w-full h-full py-2">
                    {e.label}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 w-full">
            <Button
              variant="outline"
              className="w-full py-0"
              onClick={() => setOpen(false)}
            >
              <span>Logout</span>
              <LogOut className="size-4 mx-2" />
            </Button>

            <Button
              variant={currentPath === "/profile" ? "default" : "outline"}
              className="w-full py-0"
              onClick={() => setOpen(false)}
            >
              <Link href={"/profile"}>Perfil</Link>
              <UserIcon className="size-4 mx-2" />
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

const DesktopNavigation = ({
  currentPath,
  user,
}: {
  currentPath: string;
  user: User | null;
}) => {
  return (
    <nav className="flex justify-between w-full">
      <ul className="flex flex-row gap-2">
        {navItems.map((e, i) => (
          <li key={i}>
            <Button
              variant={currentPath === e.href ? "default" : "ghost"}
              className="w-fit py-0"
            >
              <Link href={e.href} className="w-full h-full py-2">
                {e.label}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
      {user !== null && (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center p-2 gap-1">
              <span>{user.name}</span>
              <ArrowDownNarrowWide className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mx-2">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </nav>
  );
};

const Navigation = () => {
  const pathName = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const updateIsDesktop = () => setIsDesktop(window.innerWidth >= 1145);
    updateIsDesktop();
    window.addEventListener("resize", updateIsDesktop);
    return () => window.removeEventListener("resize", updateIsDesktop);
  }, []);

  return (
    <nav className="p-2">
      {isDesktop ? (
        <DesktopNavigation currentPath={pathName} user={user} />
      ) : (
        <MobileNavigation currentPath={pathName} />
      )}
    </nav>
  );
};

export default Navigation;
