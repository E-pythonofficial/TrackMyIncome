import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import StatsCard from "../components/StatsCard"
import Transactions from "../components/Transactions"
import ChartSection from "../components/ChartSection"
import API from "../api/api"

import { FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa"

const Dashboard = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const userId = localStorage.getItem("user_id")
    if (!userId) {
      navigate("/")
      return
    }

    API.get(`/dashboard/${userId}`)
      .then(res => setData(res.data))
      .catch(() => setError("Failed to load dashboard."))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center">
      <p className="text-gray-400 text-lg">Loading dashboard...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center">
      <p className="text-red-400 text-lg">{error}</p>
    </div>
  )

  const { summary } = data

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <Navbar />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <StatsCard
            title="Estimated Savings"
            amount={`₦${summary.estimated_savings.toLocaleString()}`}
            icon={<FaWallet />}
          />
          <StatsCard
            title="Total Income"
            amount={`₦${summary.total_estimated_income.toLocaleString()}`}
            color="text-green-400"
            icon={<FaArrowUp className="text-green-400" />}
          />
          <StatsCard
            title="Total Expenses"
            amount={`₦${summary.total_estimated_expenses.toLocaleString()}`}
            color="text-red-400"
            icon={<FaArrowDown className="text-red-400" />}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          <ChartSection data={data} />
          <Transactions data={data} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard