import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-black/10">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <Link to="/" className="text-xl font-black tracking-tighter">A I V a</Link>
                        <p className="mt-4 text-sm text-black/50 leading-relaxed">
                            Unveil Your Radiance
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm mb-4">Shop</h3>
                        <ul className="space-y-2">
                            <li><Link to="/products" className="text-sm text-black/50 hover:text-black">All Products</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm mb-4">Account</h3>
                        <ul className="space-y-2">
                            <li><Link to="/profile" className="text-sm text-black/50 hover:text-black">My Account</Link></li>
                            <li><Link to="/cart" className="text-sm text-black/50 hover:text-black">Cart</Link></li>
                            <li><Link to="/profile" className="text-sm text-black/50 hover:text-black">Orders</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm mb-4">Info</h3>
                        <ul className="space-y-2">
                            <li><span className="text-sm text-black/50">Free shipping over LKR 5,000</span></li>
                            <li><span className="text-sm text-black/50">Secure payment</span></li>
                            <li><span className="text-sm text-black/50">7-day returns</span></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-black/40">© 2025 AIVa. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-sm text-black/40 hover:text-black">Privacy Policy</a>
                        <a href="#" className="text-sm text-black/40 hover:text-black">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
