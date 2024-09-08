"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  BriefcaseMedical,
  ChevronFirst,
  ChevronLast,
  ClipboardList,
  LogOut,
  LucideIcon,
  Menu,
  User as UserIcon,
  Users,
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
import Image from "next/image";

type NavItem = {
  label: string;
  href: string;
  Icon: LucideIcon;
};

const navItems: NavItem[] = [
  {
    label: "Pacientes",
    href: "/patients",
    Icon: Users,
  },
  {
    label: "Doutores",
    href: "/doctors",
    Icon: BriefcaseMedical,
  },
  {
    label: "Consultas",
    href: "/appointments",
    Icon: ClipboardList,
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

// idea from this guy: https://www.youtube.com/watch?v=NFrFhBJPTmI

const DesktopItem = ({
  Icon,
  text,
  active,
  expanded,
}: {
  Icon: LucideIcon;
  text: string;
  active: boolean;
  expanded: boolean;
}) => {
  return (
    <Tooltip delayDuration={400}>
      <Button
        variant={active ? "secondary" : "ghost"}
        className={`relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group text-lg`}
      >
        <TooltipTrigger asChild>
          <Icon />
        </TooltipTrigger>
        <span
          className={`overflow-hidden text-start transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
          {!expanded && (
            <TooltipContent align="end">
              <p>{text}</p>
            </TooltipContent>
          )}
        </span>
      </Button>
    </Tooltip>
  );
};

const DesktopNavigation = ({
  currentPath,
  user,
}: {
  currentPath: string;
  user: User | null;
}) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <aside className="w-fit h-screen">
      <nav className="h-full flex flex-col bg-background border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={expanded ? 128 : 0}
            height={0}
            layout="intrinsic"
            className="overflow-hidden transition-all"
          />
          <Button
            size="sm"
            variant={"ghost"}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </Button>
        </div>
        <div className="flex-1 px-3">
          <TooltipProvider>
            {navItems.map((e, i) => (
              <Link href={e.href} key={i + 1}>
                <DesktopItem
                  active={e.href === currentPath}
                  expanded={expanded}
                  Icon={e.Icon}
                  text={e.label}
                />
              </Link>
            ))}
          </TooltipProvider>
        </div>
        {user !== null && (
          <div
            className={`border-t flex transition-all p-3 items-center ${!expanded && "justify-center"}`}
          >
            <UserIcon />
            <div
              className={`flex justify-between items-center overflow-hidden ${expanded ? "w-52 ml-3" : "w-0"}`}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{user.name}</h4>
                <span className="text-xs text-secondary-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
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
