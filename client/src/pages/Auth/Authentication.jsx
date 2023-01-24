import {
    Container,
    FormControl,
    FormLabel,
    Input,
    Button,
    ButtonGroup,
    Heading,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Spinner,
} from "@chakra-ui/react"

import { useState } from "react"
import { Link } from "react-router-dom"
import useAuthentication from "../../hooks/useAuthentication"

const Authentication = () => {
    const [page, setPage] = useState(localStorage.getItem("auth-page") || "login")

    const { message, setMessage, isLoading, auth } = useAuthentication()

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage({ title: "", status: "", msg: "" })

        let authData
        if (page == "signup") {
            authData = new FormData(e.target)
            console.log(authData)
            if (authData.get("password").length < 8) {
                setMessage({
                    status: "error",
                    title: "Password Error",
                    msg: "password length must be greater than 8",
                })
                return
            }
        } else {
            authData = JSON.stringify({ email: userData.email, password: userData.password })
        }

        await auth(page, authData)
    }

    const handlePage = (changePage) => {
        localStorage.setItem("auth-page", changePage)
        setMessage({ title: "", status: "", msg: "" })
        setPage(changePage)
    }
    return (
        <Container width="lg">
            <Heading as="h5" fontSize="3xl" color="blue.600">
                {page == "signup" ? "Signup" : "Login"}
            </Heading>
            <form onSubmit={handleSubmit}>
                {page == "signup" && (
                    <>
                        <FormControl isRequired>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Input
                                type="text"
                                name="name"
                                onChange={(e) =>
                                    setUserData((prevData) => ({
                                        ...prevData,
                                        name: e.target.value,
                                    }))
                                }
                                value={userData.name}
                                id="name"
                            />
                        </FormControl>

                        <FormControl py="3">
                            <FormLabel>Profile Picture</FormLabel>
                            <Input type="file" name="photo" />
                        </FormControl>
                    </>
                )}

                <FormControl isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                        type="email"
                        onChange={(e) =>
                            setUserData((prevData) => ({ ...prevData, email: e.target.value }))
                        }
                        name="email"
                        value={userData.email}
                    />
                </FormControl>

                <FormControl paddingBottom="3" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        onChange={(e) =>
                            setUserData((prevData) => ({ ...prevData, password: e.target.value }))
                        }
                        name="password"
                        value={userData.password}
                    />
                </FormControl>
                <Button colorScheme="blue" type="submit" minWidth="150" disabled={isLoading}>
                    {isLoading ? <Spinner /> : page == "signup" ? " Signup" : "Login"}
                </Button>
                <ButtonGroup variant="link" display="block" my="3">
                    {page == "signup" ? (
                        <Button onClick={() => handlePage("login")}>Already Registered ?</Button>
                    ) : (
                        <Button onClick={() => handlePage("signup")}>New Here ?</Button>
                    )}
                    <Button>
                        <Link to="/forget-password">Forget Password</Link>
                    </Button>
                </ButtonGroup>

                {message.status != "" && (
                    <Alert status={message.status}>
                        <AlertIcon />
                        <AlertTitle>{message.title}</AlertTitle>
                        <AlertDescription>{message.msg}</AlertDescription>
                    </Alert>
                )}
            </form>
        </Container>
    )
}

export default Authentication
