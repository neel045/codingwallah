import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
} from "@chakra-ui/react"
import { useState } from "react"
import useAuthContext from "../hooks/useAuthContext"

const ChangePassword = () => {
    const { token } = useAuthContext()
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [resMsg, setResMsg] = useState({
        status: "",
        msg: "",
        title: "",
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        const res = await fetch(`/api/auth/change-password`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ currentPassword, newPassword }),
        })

        const json = await res.json()

        if (json.status) {
            setResMsg({ status: "success", title: "Success", msg: json.message })
            setCurrentPassword("")
            setNewPassword("")
        } else {
            setResMsg({ status: "error", title: "Error", msg: json.error })
        }
    }

    return (
        <Box>
            <Heading color="blue.500">Change Passoword</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel>Current Password</FormLabel>
                    <Input
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        type="password"
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>New Password</FormLabel>
                    <Input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password"
                    />
                </FormControl>

                <Button my="3" variant="solid" colorScheme="blue" type="submit">
                    Submit
                </Button>

                {resMsg.status != "" && (
                    <Alert status={resMsg.status} mt="3">
                        <AlertIcon />
                        <AlertTitle>{resMsg.title}</AlertTitle>
                        <AlertDescription>{resMsg.msg}</AlertDescription>
                    </Alert>
                )}
            </form>
        </Box>
    )
}

export default ChangePassword
