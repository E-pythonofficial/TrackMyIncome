import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api/api"

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both fields are required.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await API.post("/login", { email, password })

      localStorage.setItem("user_id", response.data.user_id)
      localStorage.setItem("user_name", response.data.user.fullname)

      navigate("/dashboard")

    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1E293B] rounded-2xl p-8 shadow-xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-400">Income Tracker</h1>
          <p className="text-gray-400 mt-1">Welcome back</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 rounded-lg p-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 mt-2">
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-gray-400 text-sm mt-4">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}
              className="text-purple-400 cursor-pointer hover:underline">
              Register
            </span>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login