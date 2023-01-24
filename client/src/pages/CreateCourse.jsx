import {
    Alert,
    AlertDescription,
    AlertDialogFooter,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select,
    Spinner,
    Textarea,
} from "@chakra-ui/react"
import { useState } from "react"
import useAuthContext from "../hooks/useAuthContext"

const CreateCourse = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [resMsg, setResMsg] = useState({
        status: "",
        msg: "",
        title: "",
    })

    const { token } = useAuthContext()

    const [courseData, setCourseData] = useState({
        name: "",
        summary: "",
        description: "",
        category: "",
        type: "",
        price: 0,
    })

    const changeData = (e) => {
        const { name, value } = e.target
        console.log({ name, value })
        console.log(e.target)
        setCourseData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setResMsg({ status: "", msg: "", title: "" })

        const formData = new FormData(e.target)

        const res = await fetch("/api/courses/new", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })

        const json = await res.json()

        if (json.status) {
            setResMsg({ status: "success", msg: json.message, title: "Success" })
        } else {
            setResMsg({ status: "error", msg: json.error, title: "Error" })
        }

        console.log(json)
        setIsLoading(false)
    }

    return (
        <Container>
            <Heading color="blue.600">Create New Course</Heading>

            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel>Name </FormLabel>
                    <Input name="name" type="text" value={courseData.name} onChange={changeData} />
                </FormControl>
                <FormControl>
                    <FormLabel>Thumbnail </FormLabel>
                    <Input name="photo" type="file" />
                </FormControl>
                <FormControl>
                    <FormLabel>Summary </FormLabel>
                    <Input
                        type="text"
                        value={courseData.summary}
                        onChange={changeData}
                        name="summary"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Description </FormLabel>
                    <Textarea
                        size="xs"
                        value={courseData.description}
                        onChange={changeData}
                        name="description"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="category">Category: </FormLabel>
                    <Input
                        id="category"
                        onChange={changeData}
                        value={courseData.category}
                        name="category"
                        type="text"
                    />
                </FormControl>

                <FormControl>
                    <FormLabel>Free/Paid</FormLabel>
                    <Select
                        name="type"
                        value={courseData.type}
                        onChange={changeData}
                        defaultValue={"free"}
                    >
                        <option value="free">Free</option>
                        <option value="paid">Paid</option>
                    </Select>
                </FormControl>

                {courseData.type == "paid" && (
                    <FormControl>
                        <FormLabel>Price</FormLabel>
                        <Input name="price" onChange={changeData} value={courseData.price} />
                    </FormControl>
                )}

                <Button
                    mt="3"
                    colorScheme="blue"
                    variant="solid"
                    type="submit"
                    disabled={isLoading}
                    minWidth="28"
                >
                    {isLoading ? <Spinner /> : "Create"}
                </Button>

                {resMsg.status != "" && (
                    <Alert status={resMsg.status} mt="3">
                        <AlertIcon />
                        <Box>
                            <AlertTitle>{resMsg.title}</AlertTitle>
                            <AlertDescription>{resMsg.msg}</AlertDescription>
                        </Box>
                    </Alert>
                )}
            </form>
        </Container>
    )
}

export default CreateCourse
