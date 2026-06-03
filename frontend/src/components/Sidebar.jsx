const Sidebar = () => {
  return (
    <div className="w-full lg:w-[250px] bg-[#111827] p-6 border-r border-gray-800">

      <h1 className="text-3xl font-bold mb-10 text-purple-400">
        Income Tracker
      </h1>

      <div className="flex lg:flex-col gap-3 overflow-x-auto">

        <button className="bg-purple-500 px-5 py-3 rounded-xl whitespace-nowrap">
          Dashboard
        </button>

        <button className="hover:bg-[#1E293B] px-5 py-3 rounded-xl transition whitespace-nowrap">
          Transactions
        </button>

        <button className="hover:bg-[#1E293B] px-5 py-3 rounded-xl transition whitespace-nowrap">
          Analytics
        </button>

        <button className="hover:bg-[#1E293B] px-5 py-3 rounded-xl transition whitespace-nowrap">
          Settings
        </button>

      </div>

    </div>
  )
}

export default Sidebar