function App() {

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center">
          <div className="text-purple-600 font-extrabold text-2xl cursor-pointer">
            AIVa
          </div>

          <div class="hidden md:flex space-x-12 text-gray-700 font-medium ml-20">
            <a href="#" className="hover:text-purple-600 transition">Home</a>
            <a href="#" className="hover:text-purple-600 transition">Products</a>
            <a href="#" className="hover:text-purple-600 transition">Chat</a>
          </div>

          <div className="flex space-x-4 ml-auto">
            <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition">
              Login
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Register
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default App
