'use client'

import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export const ClerkWrapper = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="w-8 h-8"></div>;
  }

  return (
    <>
      <ClerkLoaded>
        <UserButton />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className='size-8 animate-spin text-slate-400' />
      </ClerkLoading>
    </>
  );
};
