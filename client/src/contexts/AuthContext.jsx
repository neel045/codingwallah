import { createContext, useEffect, useReducer } from "react"

const AuthContext = createContext()

const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                user: action.payload.user,
                token: action.payload.token || state.token,
                enrollments: action.payload.enrollments || state.enrollments,
            }

        case "SET_ENROLLMENTS":
            return {
                ...state,
                enrollments: action.payload.enrollments,
            }

        case "LOGOUT":
            return {
                user: null,
                token: "",
                enrollments: null,
            }
        default:
            return state
    }
}

const AuthContextProvider = (props) => {
    const [state, dispatch] = useReducer(AuthReducer, {
        user: null,
        token: "",
        enrollments: null,
    })

    useEffect(() => {
        let user = localStorage.getItem("user")
        if (user) {
            user = JSON.parse(user)
            dispatch({
                type: "LOGIN",
                payload: { user: user.user, token: user.token, enrollments: user.enrollments },
            })
        }
    }, [])
    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>{props.children}</AuthContext.Provider>
    )
}

export { AuthContext, AuthContextProvider }
