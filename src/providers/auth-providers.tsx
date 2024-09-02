"use client";

import LoadingSpinner from "@/components/loading-spinner";
import { useMe } from "@/features/auth/api/use-me";
import { useAuthStore } from "@/features/auth/hooks/use-auth-store";
import { User } from "@/models/User";
import { ReactNode, useCallback, useEffect } from "react";

type Props = {
  children: ReactNode;
};

export default function UserStoreProvider({ children }: Props) {
  const meQuery = useMe();
  const { setUser, clearAuth } = useAuthStore();
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
    getMe();
  }, [meQuery.data, meQuery.error, getMe]);

  if (meQuery.isLoading) {
    return <LoadingSpinner />;
  }
  return <>{children}</>;
}
