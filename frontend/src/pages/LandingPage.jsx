import { useNavigate } from "react-router-dom"
import image from '../assets/image.png'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#180a38] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="font-bold text-white text-3xl sm:text-4xl lg:text-5xl">
        Take the first step towards <span className="text-red-500">positive change</span>!
      </h1>
      <p className="mt-6 sm:mt-8 text-gray-300 text-sm sm:text-base md:text-lg max-w-md mx-auto">
        Start your journey to a more organized and fulfilling life with our powerful Habit Tracker. Stay motivated and on track!
      </p>
      <img
        src={image}
        alt="Illustration of habit tracking"
        className="lg:h-80 sm:h-64 h-44 mt-6 sm:mt-8 rotate-2 shadow-2xl shadow-black rounded-2xl"
      />
      <button
        onClick={() => navigate('/register')}
        aria-label="Start your habit tracking journey"
        className="bg-red-500 mt-8 py-2 px-6 sm:px-8 rounded-md text-white font-semibold text-sm sm:text-base"
      >
        Let's get started
      </button>
    </div>
  )
}

export default LandingPage
