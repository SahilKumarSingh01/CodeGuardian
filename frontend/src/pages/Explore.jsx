import { useState, useEffect } from "react";
import axios from "../api/axios";
import SoftwareCard from "../components/SoftwareCard";
import { Search } from "lucide-react";

export default function ExplorePage() {
  const [softwares, setSoftwares] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchSoftwares();
  }, []);

  const fetchSoftwares = async () => {
    try {
      const { data } = await axios.get("/software/search", {
        params: { keywords: search, minPrice, maxPrice },
      });
      setSoftwares(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // console.log("button is clicked");
    fetchSoftwares();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Filter Bar */}
      <form
  onSubmit={handleSearch}
  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-2xl shadow-md"
>
  <input
    type="text"
    placeholder="Search..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white text-black"
  />
  <div className="flex gap-3 w-full sm:w-auto">
    <input
      type="number"
      placeholder="Min"
      value={minPrice}
      onChange={(e) => setMinPrice(e.target.value)}
      className="flex-1 sm:flex-none w-full sm:w-24 px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white text-black"
    />
    <input
      type="number"
      placeholder="Max"
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value)}
      className="flex-1 sm:flex-none w-full sm:w-24 px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-white text-black"
    />
  </div>
  <button
    type="submit"
    className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition w-full sm:w-auto"
  >
    <Search size={18} /> Go
  </button>
</form>




      {/* Software Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {softwares.length > 0 ? (
          softwares.map((software) => (
            <SoftwareCard
              key={software._id}
              software={software}
              onView={() => {}}
              menuActions={[]}
            />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 mt-6">
            No software found.
          </p>
        )}
      </div>
    </div>
  );
}
