import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

const useLogout = () => {
    const { dispatch } = useContext(AuthContext)

    const logout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("currentCourse")
        dispatch({ type: "LOGOUT" })
    }

    return { logout }
}

export default useLogout
