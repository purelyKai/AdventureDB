import { Link } from "react-router-dom";
import {
  Sword,
  Shield,
  Scroll,
  Backpack,
  Coins,
  Users,
  BookOpen,
} from "lucide-react";

const Home = () => {
  const categories = [
    {
      name: "Characters",
      icon: <Users className="h-8 w-8" />,
      path: "/characters",
      description: "Manage your heroes and villains",
    },
    {
      name: "Classes",
      icon: <BookOpen className="h-8 w-8" />,
      path: "/classes",
      description: "Browse character classes and abilities",
    },
    {
      name: "Items",
      icon: <Backpack className="h-8 w-8" />,
      path: "/items",
      description: "Discover weapons, armor, and magical artifacts",
    },
    {
      name: "Quests",
      icon: <Scroll className="h-8 w-8" />,
      path: "/quests",
      description: "Track adventures and missions",
    },
    {
      name: "Chests",
      icon: <Coins className="h-8 w-8" />,
      path: "/chests",
      description: "Find treasures and loot",
    },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-700 to-amber-900 rounded-xl shadow-xl text-amber-50">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sword className="h-16 w-16 text-amber-300 absolute -left-20 top-0 transform -rotate-45" />
              <Shield className="h-16 w-16 text-amber-300" />
              <Sword className="h-16 w-16 text-amber-300 absolute -right-20 top-0 transform rotate-45" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to AdventureDB
          </h1>
          <p className="mt-6 text-xl text-amber-200 max-w-2xl mx-auto">
            Your ultimate database for managing fantasy adventures, characters,
            items, and quests.
          </p>
          <div className="mt-10">
            <Link
              to="/characters"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-amber-900 bg-amber-100 hover:bg-amber-200 transition-colors duration-300"
            >
              Start Your Adventure
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">
          Explore the Database
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-amber-200 hover:border-amber-400 group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-full text-amber-800 group-hover:bg-amber-200 transition-colors duration-300">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-900">
                    {category.name}
                  </h3>
                  <p className="text-amber-700">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
