"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
        </SheetHeader>
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
      </SheetContent>
    </Sheet>
  );
};

const DesktopNavigation = ({ currentPath }: { currentPath: string }) => {
  return (
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
  );
};

const Navigation = () => {
  const pathName = usePathname();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateIsDesktop = () => setIsDesktop(window.innerWidth >= 1145);
    updateIsDesktop();
    window.addEventListener("resize", updateIsDesktop);
    return () => window.removeEventListener("resize", updateIsDesktop);
  }, []);

  return (
    <nav className="p-2">
      {isDesktop ? (
        <DesktopNavigation currentPath={pathName} />
      ) : (
        <MobileNavigation currentPath={pathName} />
      )}
    </nav>
  );
};

export default Navigation;
