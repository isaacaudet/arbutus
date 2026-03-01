import { DiscoverClient } from "./DiscoverClient";

export const metadata = {
  title: "Discover Practitioners | Arbutus",
  description: "Search Jane App's marketplace to find and import practitioners by location.",
};

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-cream">
      <DiscoverClient />
    </div>
  );
}
