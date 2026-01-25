import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  const products = [
    {
      id: "p1",
      name: "CeraVe Daily Moisturizing Lotion",
      image: "https://imgur.com/T4BOVTY.jpg",
      price: 4500,
      sales: 320
    },
    {
      id: "p2",
      name: "The Ordinary Glycolic Acid 7% Exfoliating Toner 100ml",
      image: "https://imgur.com/BO65rt2.jpg",
      price: 3800,
      sales: 540
    },
    {
      id: "p3",
      name: "Anua's Niacinamide 10% + TXA 4% Dark Spot Corrector Serum",
      image: "https://imgur.com/KUODiAX.jpg",
      price: 4500,
      sales: 320
    },
    {
      id: "p4",
      name: "SKIN1004 Madagascar Centella Toning Toner 210ml",
      image: "https://imgur.com/mvBYy1A.jpg",
      price: 3800,
      sales: 540
    },
    {
      id: "p5",
      name: "Simple Water Boost Micellar Gel Facial Wash [150ml]",
      image: "https://imgur.com/vbB6CUh.jpg",
      price: 4500,
      sales: 320
    }
  ]

  const trendingProducts = [...products]
    .sort((a,b) => b.sales - a.sales)
    .slice(0,5);

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

          
    <div className="grid gap-8 
                    grid-cols-2 
                    sm:grid-cols-3 
                    md:grid-cols-4 
                    lg:grid-cols-5">
     {trendingProducts.map((product) => (
    <Link
      key={product.id}
      className="relative group overflow-hidden rounded-xl shadow-lg bg-white"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
              🔥 Trending
        </span>

        <div className="p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-purple-600 font-bold">{product.price}</p>
          <p className="text-sm text-gray-500">{product.sales} + sold</p>
        </div>
    </Link>

  ))}

    </div>
        </div>
    </section>

    {/* <section className="h-screen bg-stone-200">
      <div className="flex h-full">
        <div className="w-1/2 bg-white flex items-center justify-center">
          <h2 className="text-5xl mb-6 font-semibold font-(family-name:--my-font) ...">
            Discount
          </h2>
          </div>

          <div className="w-1/2 bg-gray-300 flex items-center justify-center">
            <h2 className="text-5xl mb-6 font-semibold font-(family-name:--my-font) ...">
              Offer
            </h2>
          </div>
        </div>
    </section> */}
    </div>
  );
};

export default Home;

