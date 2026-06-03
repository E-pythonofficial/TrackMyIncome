import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from '../api/api'



const INCOME_TYPES = [
  "salary", "freelance", "business", "investment",
  "rental", "side_hustle", "allowance", "other"
]

const EXPENSE_TYPES = [
  "food", "transport", "housing", "utilities", "healthcare",
  "education", "entertainment", "clothing", "savings",
  "debt_repayment", "family", "business_expense", "other"
]

const Register = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Section 1 — Personal Details
  const [personal, setPersonal] = useState({
    fullname: "",
    email: "",
    password: "",
  })

  // Section 2 — Income Streams
  const [incomeStreams, setIncomeStreams] = useState([
    { source_name: "", income_type: "salary", estimated_monthly_amount: "", currency: "NGN" }
  ])

  // Section 3 — Expense Categories
  const [expenseCategories, setExpenseCategories] = useState([
    { category_name: "", category_type: "food", estimated_monthly_spend: "", priority: "medium" }
  ])

  // Income handlers
  const addIncome = () => {
    setIncomeStreams([...incomeStreams, {
      source_name: "", income_type: "salary",
      estimated_monthly_amount: "", currency: "NGN"
    }])
  }

  const removeIncome = (index) => {
    setIncomeStreams(incomeStreams.filter((_, i) => i !== index))
  }

  const updateIncome = (index, field, value) => {
    const updated = [...incomeStreams]
    updated[index][field] = value
    setIncomeStreams(updated)
  }

  // Expense handlers

  const addExpense = () => {
    setExpenseCategories([...expenseCategories, {
      category_name: "", category_type: "food",
      estimated_monthly_spend: "", priority: "medium"
    }])
  }

  const removeExpense = (index) => {
    setExpenseCategories(expenseCategories.filter((_, i) => i !== index))
  }

  const updateExpense = (index, field, value) => {
    const updated = [...expenseCategories]
    updated[index][field] = value
    setExpenseCategories(updated)
  }

  // Submit
  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await API.post("/register", {
        fullname: personal.fullname,
        email: personal.email,
        password: personal.password,
        income_streams: incomeStreams.map(s => ({
          ...s,
          estimated_monthly_amount: parseFloat(s.estimated_monthly_amount) || 0
        })),
        expense_categories: expenseCategories.map(e => ({
          ...e,
          estimated_monthly_spend: parseFloat(e.estimated_monthly_spend) || 0
        }))
      })

      // Save user_id to localStorage for dashboard use
      localStorage.setItem("user_id", response.data.user_id)
      localStorage.setItem("user_name", response.data.user.fullname)

      // Go to dashboard
      navigate("/dashboard")

    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try again.")
    } finally {
      setLoading(false)
    }
  }


  // Step validation
  const nextStep = () => {
    if (step === 1) {
      if (!personal.fullname || !personal.email || !personal.password) {
        setError("All fields are required.")
        return
      }
    }
    if (step === 2) {
      if (incomeStreams.some(s => !s.source_name || !s.estimated_monthly_amount)) {
        setError("Please fill in all income fields.")
        return
      }
    }
    setError("")
    setStep(step + 1)
  }

  const prevStep = () => {
    setError("")
    setStep(step - 1)
  }


  // UI
  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-3 md:p-6">
      <div className="w-full max-w-xl bg-[#1E293B] rounded-2xl p-5 md:p-8 shadow-xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-400">Income Tracker</h1>
          <p className="text-gray-400 mt-1">Create your account</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step === s ? "bg-purple-500 text-white" :
                  step > s ? "bg-green-500 text-white" :
                  "bg-[#334155] text-gray-400"}`}>
                {step > s ? "✓" : s}
              </div>
              {s < 3 && <div className={`w-12 h-1 rounded ${step > s ? "bg-green-500" : "bg-[#334155]"}`} />}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* ---- STEP 1 — Personal Details ---- */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Personal Details</h2>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={personal.fullname}
                onChange={e => setPersonal({ ...personal, fullname: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={personal.email}
                onChange={e => setPersonal({ ...personal, email: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={personal.password}
                onChange={e => setPersonal({ ...personal, password: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        )}

        {/* ---- STEP 2 — Income Streams ---- */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Income Streams</h2>
            <p className="text-sm text-gray-400 -mt-2 mb-4">How do you make money? Add all your income sources.</p>

            {incomeStreams.map((stream, index) => (
              <div key={index} className="bg-[#0F172A] border border-[#334155] rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-400 font-medium">Income Source {index + 1}</span>
                  {incomeStreams.length > 1 && (
                    <button onClick={() => removeIncome(index)}
                      className="text-red-400 text-xs hover:text-red-300">
                      Remove
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="e.g. Salary, Freelance Design"
                  value={stream.source_name}
                  onChange={e => updateIncome(index, "source_name", e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />

                <select
                  value={stream.income_type}
                  onChange={e => updateIncome(index, "income_type", e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  {INCOME_TYPES.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace("_", " ")}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Estimated monthly amount (NGN)"
                  value={stream.estimated_monthly_amount}
                  onChange={e => updateIncome(index, "estimated_monthly_amount", e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            ))}

            <button onClick={addIncome}
              className="w-full border border-dashed border-purple-500 text-purple-400 rounded-xl py-3 text-sm hover:bg-purple-500/10 transition">
              + Add Another Income Source
            </button>
          </div>
        )}

        {/* ---- STEP 3 — Expense Categories ---- */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Expense Categories</h2>
            <p className="text-sm text-gray-400 -mt-2 mb-4">What do you spend money on? Add your spending categories.</p>

            {expenseCategories.map((category, index) => (
              <div key={index} className="bg-[#0F172A] border border-[#334155] rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-purple-400 font-medium">Expense {index + 1}</span>
                  {expenseCategories.length > 1 && (
                    <button onClick={() => removeExpense(index)}
                      className="text-red-400 text-xs hover:text-red-300">
                      Remove
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="e.g. Food, Transport, Rent"
                  value={category.category_name}
                  onChange={e => updateExpense(index, "category_name", e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />

                <select
                  value={category.category_type}
                  onChange={e => updateExpense(index, "category_type", e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  {EXPENSE_TYPES.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1).replace("_", " ")}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Estimated monthly spend (NGN)"
                  value={category.estimated_monthly_spend}
                  onChange={e => updateExpense(index, "estimated_monthly_spend", e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />

                <select
                  value={category.priority}
                  onChange={e => updateExpense(index, "priority", e.target.value)}
                  className="w-full bg-[#1E293B] border border-[#334155] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500">
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            ))}

            <button onClick={addExpense}
              className="w-full border border-dashed border-purple-500 text-purple-400 rounded-xl py-3 text-sm hover:bg-purple-500/10 transition">
              + Add Another Expense
            </button>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button onClick={prevStep}
              className="px-6 py-3 rounded-lg border border-[#334155] text-gray-400 hover:text-white hover:border-gray-400 transition">
              Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button onClick={nextStep}
              className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold transition">
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold transition disabled:opacity-50">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default Register