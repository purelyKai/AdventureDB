import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Adventure Game DBMS
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          "Characters",
          "Classes",
          "Items",
          "Quests",
          "Chests",
          "Character_has_Items",
          "Chest_has_Items",
        ].map((page) => (
          <Link
            key={page}
            to={`/${page.toLowerCase()}`}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">{page}</h2>
            <p className="text-gray-600">Manage {page.toLowerCase()} data</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
