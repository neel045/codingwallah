import {
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Spinner,
    Alert,
    AlertTitle,
    AlertDescription,
    AlertIcon,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const ResetPassowrd = () => {
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState({
        title: "",
        status: "",
        msg: "",
    })

    const [validUrl, setValidUrl] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const { userId, token } = useParams()

    useEffect(() => {
        const verifyResetPasswordToken = async () => {
            const res = await fetch(`/api/auth/reset-password/${userId}/${token}`)
            const json = await res.json()

            if (json.status) {
                setValidUrl(true)
            }
        }

        verifyResetPasswordToken()
    }, [userId, token])

    const resetPassword = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage({ title: "", status: "", msg: "" })

        if (password.length < 8) {
            setMessage({
                title: "Error",
                status: "error",
                msg: "Password length must be greater or equal to 8",
            })
            setIsLoading(false)
            return
        }

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: password }),
        }

        const res = await fetch(`/api/auth/reset-password/${userId}/${token}`, options)
        const json = await res.json()

        if (json.status) {
            setMessage({ title: "Success", status: "success", msg: json.message })
        } else {
            setMessage({ title: "Error", status: "error", msg: json.error })
        }
        setIsLoading(false)
    }
    return (
        <Container>
            {validUrl ? (
                <>
                    <Heading as="h6" color="blue.600" mb="10">
                        Reset Password
                    </Heading>
                    <form onSubmit={resetPassword}>
                        <FormControl mb="5" isRequired>
                            <FormLabel>Password: </FormLabel>
                            <Input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            minW="150"
                            variant="solid"
                            colorScheme="blue"
                            disabled={isLoading}
                        >
                            {isLoading ? <Spinner /> : "Change Password"}
                        </Button>

                        {message.status != "" && (
                            <Alert status={message.status} mt="3">
                                <AlertIcon />
                                <AlertTitle>{message.title}</AlertTitle>
                                <AlertDescription>{message.msg}</AlertDescription>
                            </Alert>
                        )}
                    </form>
                </>
            ) : (
                <Heading as="h6" color="blue.600" mb="10">
                    Invalid Url
                </Heading>
            )}
        </Container>
    )
}

export default ResetPassowrd
