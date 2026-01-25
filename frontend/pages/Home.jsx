import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();


  return (
    <div className="p-12">
      {user ? (
        <h1 className="text-5xl font-bold">
          {`Welcome ${user.name}`}
        </h1>
      ) : (
        <h1 className="text-5xl font-bold">Welcome Guest</h1>
      )}
    </div>
  );
};

export default Home;
