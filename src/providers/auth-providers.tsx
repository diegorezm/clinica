"use client";

import LoadingSpinner from "@/components/loading-spinner";
import { useMe } from "@/features/auth/api/use-me";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";
import { User } from "@/models/User";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect } from "react";

type Props = {
  children: ReactNode;
};

export default function UserStoreProvider({ children }: Props) {
  const { setUser, clearAuth } = useAuthStore();
  const router = useRouter();
  const meQuery = useMe();
  const getMe = useCallback(() => {
    if (meQuery.isLoading) return;
    const cookieUser = meQuery.data?.user;
    if (!cookieUser) {
      clearAuth();
    } else {
      const newUser: User = {
        ...cookieUser,
        createdAt: new Date(cookieUser.createdAt),
        updatedAt: new Date(cookieUser.updatedAt),
      };
      setUser(newUser);
    }
  }, [meQuery.data, meQuery.isLoading, setUser, clearAuth]);

  useEffect(() => {
    console.log("running");
    if (meQuery.error) {
      clearAuth();
      router.push("/login");
    } else {
      getMe();
    }
  }, [meQuery.error, getMe, router, clearAuth]);

  if (meQuery.isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
