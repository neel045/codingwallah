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
import { useState } from "react"

const ForgetPassword = () => {
    const [email, setEmail] = useState("")

    const [message, setMessage] = useState({
        title: "",
        status: "",
        msg: "",
    })

    const [isLoading, setIsLoading] = useState(false)

    const forgetPassword = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage({ title: "", status: "", msg: "" })

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
        }

        const res = await fetch(`/api/auth/forget-password`, options)
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
            <Heading as="h6" color="blue.600" mb="10">
                Forget Password ?
            </Heading>
            <form onSubmit={forgetPassword}>
                <FormControl mb="5" isRequired>
                    <FormLabel>Email: </FormLabel>
                    <Input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>

                <Button
                    type="submit"
                    minW="150"
                    variant="solid"
                    colorScheme="blue"
                    disabled={isLoading}
                >
                    {isLoading ? <Spinner /> : "Submit"}
                </Button>

                {message.status != "" && (
                    <Alert status={message.status} m="3">
                        <AlertIcon />
                        <AlertTitle>{message.title}</AlertTitle>
                        <AlertDescription>{message.msg}</AlertDescription>
                    </Alert>
                )}
            </form>
        </Container>
    )
}

export default ForgetPassword
