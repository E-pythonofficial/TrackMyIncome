const ChartSection = ({ data }) => {
  const incomeStreams = data?.income_streams || []
  const expenseCategories = data?.expense_categories || []

  const allItems = [
    ...incomeStreams.map(s => ({
      label: s.source_name,
      amount: parseFloat(s.estimated_monthly_amount),
      type: "income"
    })),
    ...expenseCategories.map(e => ({
      label: e.category_name,
      amount: parseFloat(e.estimated_monthly_spend),
      type: "expense"
    }))
  ]

  const maxAmount = Math.max(...allItems.map(i => i.amount), 1)

  return (
    <div className="bg-[#1E293B] rounded-2xl p-6 h-[320px]">
      <h2 className="text-2xl font-bold mb-6 text-white">Analytics</h2>

      <div className="flex items-end gap-2 h-[200px]">
        {allItems.map((item, i) => (
          <div key={i} className="flex flex-col items-center w-full gap-1">
            <div
              className={`w-full rounded-t-xl ${item.type === "income" ? "bg-green-500" : "bg-red-500"}`}
              style={{ height: `${(item.amount / maxAmount) * 100}%` }}
            />
            <span className="text-[9px] text-gray-400 text-center truncate w-full">
              {item.label}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ChartSection