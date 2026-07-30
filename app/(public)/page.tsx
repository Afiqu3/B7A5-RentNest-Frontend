import About from "./_components/home/About";
import Banner from "./_components/home/Banner";
import LatestProperties from "./_components/home/LatestProperties";
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
    </div>
  );
}
