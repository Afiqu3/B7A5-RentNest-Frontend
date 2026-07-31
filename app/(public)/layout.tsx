import { Suspense } from "react";

import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import type { IUser } from "@/lib/types";
import { getMe } from "@/service/getMe";

/**
 * `getMe` reads cookies, which is request-time work. Keeping it behind its own
 * Suspense boundary lets the rest of the route prerender as a static shell
 * (see next.config.ts `cacheComponents`) instead of blocking the whole page.
 */
const SignedOut = {
  success: false,
  statusCode: 401,
  message: "Loading session",
  data: {},
} as unknown as IUser;

async function SessionNavbar() {
  const user = await getMe();
  return <Navbar user={user} />;
}

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Suspense fallback={<Navbar user={SignedOut} />}>
        <SessionNavbar />
      </Suspense>
      {children}
      <Footer />
    </div>
  );
};

export default PublicLayout;
