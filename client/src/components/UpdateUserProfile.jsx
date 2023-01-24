import { Heading, Spinner, useDisclosure } from "@chakra-ui/react"
import useAuthContext from "../hooks/useAuthContext"
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    FormControl,
    FormLabel,
    Input,
    Switch,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"

const UpdateUserProfile = () => {
    const { user, token, dispatch } = useAuthContext()
    const [isLoading, setIsLoading] = useState(false)
    const [userUpdateData, setUserUpdateData] = useState({
        name: "",
        about: "",
        isEducator: null,
    })
    const [resMsg, setResMsg] = useState({
        status: "",
        msg: "",
        title: "",
    })
    const [filePath, setFilePath] = useState("")

    useEffect(() => {
        setUserUpdateData({
            name: user.name,
            about: user.about,
            isEducator: user.isEducator || false,
        })
    }, [user])

    const updateUserDetails = async (e) => {
        e.preventDefault()
        const formdata = new FormData(e.target)
        setIsLoading(true)

        try {
            const res = await fetch(`/api/users/update-me`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formdata,
            })

            const json = await res.json()
            if (json.status) {
                localStorage.setItem("user", JSON.stringify({ user: json.data, token }))
                dispatch({ type: "LOGIN", payload: { user: json.data } })
                setResMsg({ status: "success", msg: json.message, title: "Success" })
            } else {
                setResMsg({ status: "error", msg: json.error, title: "Error" })
            }
            setFilePath("")
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <Heading color="blue.500">User Account</Heading>
            <form onSubmit={updateUserDetails}>
                <FormControl>
                    <FormLabel>Name:</FormLabel>
                    <Input
                        name="name"
                        type="text"
                        value={userUpdateData.name}
                        onChange={(e) =>
                            setUserUpdateData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Profile Picture:</FormLabel>
                    <Input
                        name="photo"
                        type="file"
                        value={filePath}
                        onChange={(e) => setFilePath(e.target.value)}
                    />
                </FormControl>

                <FormControl display="flex" mt="3">
                    <FormLabel htmlFor="isEducator">Wants to Become Educator ?</FormLabel>
                    <Switch
                        id="isEducator"
                        isChecked={userUpdateData.isEducator}
                        onChange={() =>
                            setUserUpdateData((prev) => ({
                                ...prev,
                                isEducator: !prev.isEducator,
                            }))
                        }
                        value={userUpdateData.isEducator}
                        name="isEducator"
                    />
                </FormControl>

                {userUpdateData.isEducator && (
                    <FormControl>
                        <FormLabel>Tell us About Yourself </FormLabel>
                        <Input
                            name="about"
                            type="text"
                            value={userUpdateData.about}
                            onChange={(e) =>
                                setUserUpdateData((prev) => ({
                                    ...prev,
                                    about: e.target.value,
                                }))
                            }
                        />
                    </FormControl>
                )}
                {resMsg.status != "" && (
                    <Alert status={resMsg.status} mt="3">
                        <AlertIcon />
                        <AlertTitle>{resMsg.title}</AlertTitle>
                        <AlertDescription>{resMsg.msg}</AlertDescription>
                    </Alert>
                )}

                <Button colorScheme="blue" type="submit" disabled={isLoading} my="3">
                    {isLoading ? <Spinner /> : "Update"}
                </Button>
            </form>
        </>
    )
}

export default UpdateUserProfile
