import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Dashboard from "./pages/Dashboard"
import WeatherCard from "./components/WeatherCard"
import "./index.css"

function App() {
  return (
    <Router>
      <div
        className="min-h-screen bg-[#0a174e] bg-animada"
        style={{
          backgroundImage: "url('/fondo-cielo.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
        }}
      >
        <Header />
        <main className="container mx-auto px-4 py-6 pt-32">
          <div className="mb-8">
            <WeatherCard />
          </div>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
