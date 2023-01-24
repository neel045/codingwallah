import { Button, Center, Container, Flex, Heading, Img } from "@chakra-ui/react"
import { useEffect } from "react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import successMark from "../../assets/success-green-check-mark-icon.svg"

const VerifyEmail = () => {
    const [validUrl, setValidUrl] = useState(false)

    const { userId, token } = useParams()

    useEffect(() => {
        const verifyEmail = async () => {
            const res = await fetch(`/api/auth/verify-email/${userId}/${token}`)
            const json = await res.json()

            console.log({ json })

            if (json.status) {
                setValidUrl(true)
            }
        }
        verifyEmail()
    }, [userId, token, token])

    return (
        <Flex>
            <Center w="100vw" h="65vh">
                {validUrl ? (
                    <Container>
                        <Img src={successMark} boxSize="280" />
                        <Heading as="h6" fontSize="40" marginRight="18" py="5">
                            Email Verified!
                        </Heading>

                        <Button
                            variant="solid"
                            colorScheme="blue"
                            onClick={() => localStorage.setItem("auth-page", "login")}
                        >
                            <Link to="/auth">Login</Link>
                        </Button>
                    </Container>
                ) : (
                    <Heading as="h4">Invalid Link</Heading>
                )}
            </Center>
        </Flex>
    )
}

export default VerifyEmail
