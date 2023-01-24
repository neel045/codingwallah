import { useState } from "react"
import useAuthContext from "./useAuthContext"

const useAuthentication = () => {
    const [message, setMessage] = useState({
        status: "",
        title: "",
        msg: "",
    })

    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useAuthContext()

    const auth = async (type, data) => {
        setIsLoading(true)
        const url = `/api/auth/${type == "signup" ? "signup" : "signin"}`
        const options = {
            method: "POST",
            body: data,
        }
        if (type == "login") {
            options["headers"] = { "Content-Type": "application/json" }
        }
        console.log(data)
        const res = await fetch(url, options)
        const json = await res.json()
        console.log(json)

        if (json.status) {
            setMessage({ status: "success", title: "Auth", msg: json.message })
            if (type == "login") {
                localStorage.setItem(
                    "user",
                    JSON.stringify({ user: json.data.user, token: json.data.token })
                )
                dispatch({
                    type: "LOGIN",
                    payload: { user: json.data.user, token: json.data.token },
                })
            }
        } else {
            setMessage({ status: "error", title: "AuthError", msg: json.error })
        }

        setIsLoading(false)
    }

    return { message, setMessage, isLoading, setIsLoading, auth }
}

export default useAuthentication
