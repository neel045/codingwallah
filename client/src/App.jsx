import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import useAuthContext from "./hooks/useAuthContext"
import Authentication from "./pages/Auth/Authentication"
import ForgetPassword from "./pages/Auth/ForgetPassword"
import ResetPassowrd from "./pages/Auth/ResetPassword"
import VerifyEmail from "./pages/Auth/VerifyEmail"
import CourseDetail from "./pages/CourseDetail"
import CreateCourse from "./pages/CreateCourse"
import EditCourse from "./pages/EditCourse"
import EnrollmentDetail from "./pages/EnrollmentDetail"
import Home from "./pages/Home"
import MyEnrollments from "./pages/MyEnrollments"
import Profile from "./pages/Profile"
import Teach from "./pages/Teach"

function App() {
    const { user } = useAuthContext()
    const location = useLocation()

    return (
        <div className="App">
            <Navbar />

            <Routes>
                <Route
                    exact
                    path="/auth"
                    element={user ? <Navigate to="/" /> : <Authentication />}
                />
                <Route exact path="/forget-password" element={<ForgetPassword />} />
                <Route exact path="/verify-email/:userId/:token" element={<VerifyEmail />} />
                <Route exact path="/reset-password/:userId/:token" element={<ResetPassowrd />} />
                <Route exact path="/my-enrollments" element={user && <MyEnrollments />} />
                <Route
                    exact
                    path="/teach/courses"
                    element={user ? <Teach /> : <Navigate to="/auth" />}
                />
                <Route
                    exact
                    path="/teach/courses/new"
                    element={user ? <CreateCourse /> : <Navigate to="/auth" />}
                />
                <Route
                    exact
                    path="/teach/courses/edit/:courseId"
                    element={user ? <EditCourse /> : <Navigate to="/auth" />}
                />
                <Route
                    exact
                    path="/courses/:courseId"
                    element={user ? <CourseDetail /> : <Navigate to="/auth" />}
                />
                <Route
                    exact
                    path="/profile/:userId"
                    element={user ? <Profile /> : <Navigate to="/" />}
                />
                <Route
                    exact
                    path="/profile/payment/payment-details"
                    element={user ? <h1>payment details</h1> : <Navigate to="/" />}
                />
                <Route
                    exact
                    path="/enrollments/:enrollmentId"
                    element={user && <EnrollmentDetail />}
                />
                <Route exact path="/" element={user ? <Home /> : <Authentication />} />
                {/* <Route exact path="/video"  /> */}
            </Routes>
        </div>
    )
}

export default App
