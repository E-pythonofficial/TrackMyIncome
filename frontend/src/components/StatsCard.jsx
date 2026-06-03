const StatsCard = ({
  title,
  amount,
  color,
  icon,
}) => {
  return (
    <div className="bg-[#1E293B] p-6 rounded-2xl text-white">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-400">
            {title}
          </p>

          <h2 className={`text-3xl font-bold mt-4 ${color || ""}`}>
            {amount}
          </h2>

        </div>

        <div className="text-3xl">
          {icon}
        </div>

      </div>

    </div>
  )
}

export default StatsCard