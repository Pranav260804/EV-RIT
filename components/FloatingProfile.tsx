"use client";

import React from 'react';
import { useSession } from "next-auth/react";
import UserProfileDropdown from "./UserProfileDropdown";

export default function FloatingProfile() {
  const { data: session, status } = useSession();

  if (status === "loading" || status === "unauthenticated" || !session?.user) {
    return null;
  }

  // Render floating profile unconditionally if authenticated
  return <UserProfileDropdown />;
}
