const Footer = () => {
    return (
        <footer className="bg-stone-900 text-stone-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6">

             <div>
          <h2 className="text-xl font-semibold text-white">
            YourBrand
          </h2>
          <p className="text-sm mt-2">
            Luxury skincare made with love ✨
          </p>
        </div>

         <div className="text-sm space-y-2">
          <a href="/" className="block hover:text-white">Home</a>
          <a href="/about" className="block hover:text-white">About</a>
          <a href="/contact" className="block hover:text-white">Contact</a>
        </div>

         <div className="text-sm">
          <p>Email: support@yourbrand.com</p>
          <p>© {new Date().getFullYear()} YourBrand</p>
        </div>
    
   </div>
    </footer>
  );
};

export default Footer;