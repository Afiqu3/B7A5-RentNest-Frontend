import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { getMe } from "@/service/getMe";
import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();
  
  return (
    <div>
      <Navbar user={user} />
      {children}
      <Footer />
    </div>
  );
};

export default AuthLayout;
