import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  const brands = [
    {name: "Ordinary", image: "https://imgur.com/xwRZLi1.jpg", link:"/"},
    {name: "Cetaphil", image: "https://imgur.com/bnMqC23.jpg", link:"/"},
    {name: "Cerave", image: "https://imgur.com/IdFvh7X.jpg", link:"/"},
    {name: "Simple", image: "https://imgur.com/e12jn5w.jpg", link:"/"},
    {name: "Anua", image: "https://imgur.com/TjsQnFq.jpg", link:"/"},
    {name: "Centella", image: "https://imgur.com/cMbpkyR.jpg", link:"/"},
    {name: "Neutrogena", image: "https://imgur.com/5AP5Ipu.jpg", link:"/"},
    {name: "Cosrx", image: "https://imgur.com/UqpRJlJ.jpg", link:"/"},
    {name: "Garnier", image: "https://imgur.com/Ci2S4gf.jpg", link:"/"}
  ];
  
return (

  <div className="w-full bg-white">

  <section
  className="relative min-h-screen bg-cover bg-center"
  style={{ backgroundImage: "url('https://imgur.com/5eakXZr.jpg')" }}
>
  <div className="absolute inset-0 bg-black/10"></div> 

  <div className="relative flex items-center justify-end p-10 text-right text-white">
    {user ? (
      <h2 className="pt-70 pb-10 text-4xl font-semibold">
        Welcome {user?.name}
      </h2>
    ) : (
      <h1 className="pt-100 text-8xl">
        Give Luxury <br />
        To Your Skin
      </h1>
    )}
  </div>
</section>

<section className="min-h-screen bg-stone-200">
  <div className="w-full px-10 pt-10">
    <h2 className="text-5xl mb-12 font-semibold font-(family-name:--my-font) ...">
      Our Brands
    </h2>

    <div className="grid gap-8 
                    grid-cols-2 
                    sm:grid-cols-3 
                    md:grid-cols-4 
                    lg:grid-cols-5">
      {brands.map((brand, index) => (
        <a
          key={index}
          href={brand.link}
          className="relative group overflow-hidden rounded-xl shadow-lg"
        >
          <img
            src={brand.image}
            alt={brand.name}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-end">
            <p className="text-white text-lg font-medium p-4">
              {brand.name}
            </p>
          </div>
        </a>
      ))}
    </div>
  </div>
</section>

    <section className="min-h-screen bg-stone-400">
      <div className="w-full pt-10 px-10">
          <h2 className="text-5xl mb-12 font-semibold font-(family-name:--my-font) ...">
            Trending Products
          </h2>
        </div>
    </section>

    <section className="h-screen bg-stone-200">
      <div className="text-left max-w-3xl pt-10 p-10">
          <h2 className="text-5xl mb-6 font-semibold font-(family-name:--my-font) ...">
            Promo Banners
          </h2>
        </div>
    </section>

    <section className="h-screen bg-stone-400">
      <div className="text-left max-w-3xl pt-10 p-10">
          <h2 className="text-5xl mb-6 font-semibold font-(family-name:--my-font) ...">
            footer
          </h2>
        </div>
    </section>
    </div>
  );
};

export default Home;

