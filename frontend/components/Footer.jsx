import { Link  } from "react-router-dom"; 

const Footer = () => {
    return (
        <footer className="bg-stone-900 text-stone-300 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-6">

            <div className="flex-1 pr-6 border-r border-stone-700 flex flex-col space-y-6">
                <Link to="/" className="cursor-pointer">
                    <img
                        src="https://imgur.com/IOdaMXU.jpg"
                        alt="AIVa logo"
                        className="h-20 w-auto"
                    />
                </Link>
            <div className="flex items-center space-x-9">
                <a
                    href="https://www.facebook.com/share/1NVw4umQMF/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="https://imgur.com/8mC1mTM.png"
                        alt="facebook logo"
                        className="h-9 w-auto"
                    />
                </a>

                <a
                    href="https://www.instagram.com/myskin.sl?igsh=MXFpZHJsMG0ycDl1MA%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"

                >
                    <img
                        src="https://imgur.com/R5J046X.png"
                        alt="instagram logo"
                        className="h-9 w-auto"
                    />
                </a>

                <a
                    href="https://wa.me/message/PNZZQOKB6TE3A1"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="https://imgur.com/ySLaTtP.png"
                        alt="whatsapp logo"
                        className="h-9 w-auto"
                    />
                </a>
            </div>
            </div>

          <div className="flex-1 px-6 border-r border-stone-700">
    <h2 className="text-white font-semibold text-center">CONTACT US</h2>
    <ul className="text-sm mt-2 space-y-2 text-center">
      <p>+94 77 591 6535</p>
      <br/>
      <li><a href="/" className="hover:text-white">AIVabranded@gmail.com</a></li>
      <br/>
      <p>No: 506,<br/>
      Victory Garden,<br/>
      Malabe<br/>
      Western Province<br/>
      Sri Lanka
      </p>
    </ul>
  </div>

  <div className="flex-1 px-6 border-r border-stone-700">
    <h2 className="text-white font-semibold text-center">HOURS</h2>
    <ul className="text-sm mt-2 space-y-2 text-center">
        <p>Tues, Thurs, Fri | 11AM - 5PM</p>
        <p>Mon & Wed | 11AM - 4PM</p>
        <p>Sat | 11AM - 2PM</p>
        <p>CLOSED Sunday</p>
    </ul>
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