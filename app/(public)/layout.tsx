import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar
        // user={{
        //   name: "Ayesha Rahman",
        //   email: "ayesha@example.com",
        //   role: "tenant",
        // }}
      />
      {children}
      <Footer />
    </div>
  );
};

export default PublicLayout;
