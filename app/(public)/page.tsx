import About from "./_components/home/About";
import Banner from "./_components/home/Banner";
import FAQ from "./_components/home/FAQ";
import LatestProperties from "./_components/home/LatestProperties";
import Newsletter from "./_components/home/Newsletter";
import Reviews from "./_components/home/Reviews";
import Service from "./_components/home/Service";

export default function HomePage() {
  return (
    <div>
      <Banner />
      <Service />
      <About />
      <LatestProperties />
      <Reviews />
      <FAQ />
      <Newsletter />
    </div>
  );
}
