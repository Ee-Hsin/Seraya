import ResponsiveNavBar from "./components/ResponsiveNavBar"
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom"
import { HomePage } from "./pages/homePage"
import ErrorPage from "./components/ErrorPage"
import { PerformancePage } from "./pages/PerformancePage"
import { LettersPage } from "./pages/LettersPage"
import { BlogPage } from "./pages/BlogPage"
import { StrategyPage } from "./pages/StrategyPage"

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
        <Route index element={<HomePage />} />
        <Route path="/strategy" element={<StrategyPage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/letters" element={<LettersPage />} />
        <Route path="/blog" element={<BlogPage />} />
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

const Root = () => {
  return (
    <>
      <ResponsiveNavBar />
      <Outlet />
    </>
  )
}

export default App
