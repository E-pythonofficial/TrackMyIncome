import {
  FaBell,
  FaSearch,
} from "react-icons/fa"

const Navbar = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center mb-8">

      {/* Search */}
      <div className="bg-[#1E293B] flex items-center gap-3 px-4 py-3 rounded-xl w-full md:w-[350px]">

        <FaSearch className="text-gray-400" />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-white w-full"
        />

      </div>

      {/* Right Side */}
      <div className="flex items-center justify-between md:justify-end gap-4">

        <button className="bg-[#1E293B] p-4 rounded-xl">
          <FaBell />
        </button>

        <div className="flex items-center gap-3 bg-[#1E293B] px-4 py-2 rounded-xl">

          <div className="w-10 h-10 rounded-full bg-purple-500"></div>

          <div>
            <h3 className="font-semibold">
              Sorochi
            </h3>

            <p className="text-sm text-gray-400">
              Premium User
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Navbar