const Transactions = ({ data }) => {
  const incomeStreams = data?.income_streams || []
  const expenseCategories = data?.expense_categories || []

  return (
    <div className="bg-[#1E293B] rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Recent Transactions</h2>

      <div className="space-y-4">

        {incomeStreams.map((stream, i) => (
          <div key={i} className="bg-[#0F172A] p-4 rounded-xl flex justify-between text-white">
            <span>{stream.source_name}</span>
            <span className="text-green-400">
              +₦{parseFloat(stream.estimated_monthly_amount).toLocaleString()}
            </span>
          </div>
        ))}

        {expenseCategories.map((cat, i) => (
          <div key={i} className="bg-[#0F172A] p-4 rounded-xl flex justify-between text-white">
            <span>{cat.category_name}</span>
            <span className="text-red-400">
              -₦{parseFloat(cat.estimated_monthly_spend).toLocaleString()}
            </span>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Transactions