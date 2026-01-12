import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState({
    houseNo: "", 
    street: "",
    city: "",
    district: "",
    postalcode: "",
    country: ""
  });

  const handleAddressChange= (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const [contactno, setContactno] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmpassword) {
      alert("Passwords do not match!");
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register',{ name, email, password });

      setSuccess(data.message); 

      setTimeout(() => {
        navigate('/login');
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed, Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white py-12">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-purple-600 mb-6 text-center">
          REGISTER
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600 bg-white text-black"
            required
          />

          <input
            type="date"
            name="birthdate"
            placeholder="Birth Date"
            value={birthdate}
            onChange={ (e) => setBirthdate(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600 bg-white text-black"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600 bg-white text-black"
            required
          />

          <input
            type="text" 
            name="houseNo"
            placeholder="House No"
            value={address.houseNo}
            onChange={handleAddressChange}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600 bg-white text-black"
          />

          <input
            type="text"
            name="street"
            placeholder="Street/Lane"
            value={address.street}
            onChange={handleAddressChange}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600 bg-white text-black"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleAddressChange}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600 bg-white text-black"
          />

          <input
            type="text"
            name="district"
            placeholder="District"
            value={address.district}
            onChange={handleAddressChange}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600 bg-white text-black"
          />

          <input
            type="number"
            name="postalcode"
            placeholder="Postal Code"
            value={address.postalcode}
            onChange={handleAddressChange}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600 bg-white text-black"
          />

          <input
            type="text"
            name="street"
            placeholder="Street/Lane"
            value={address.street}
            onChange={handleAddressChange}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600 bg-white text-black"
          />

          <select class="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600 bg-white text-black">
            <option>Sri Lanka</option>
          </select>

          <input
            type="number"
            name="contactno"
            placeholder="Contact Number"
            value={contactno}
            onChange={(e) => setContactno(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600 bg-white text-black"
            required         
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600 bg-white text-black"
            required
          />

          <input
            type="password"
            name="confirmpassword"
            placeholder="Confirm Password"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-purple-600 bg-white text-black"
            required
          />

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm mb-4 text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
            } text-white py-2 rounded transition`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
