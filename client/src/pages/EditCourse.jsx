import { DeleteIcon, EditIcon, MinusIcon, StarIcon } from "@chakra-ui/icons"
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Avatar,
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Input,
    List,
    ListIcon,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Spinner,
    Text,
    Textarea,
    useDisclosure,
    VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { useEffect } from "react"
import { json, useParams } from "react-router-dom"
import TextEditor from "../components/TextEditor"
import useAuthContext from "../hooks/useAuthContext"
import ReactMarkdown from "react-markdown"

const EditCourse = () => {
    const [course, setCourse] = useState(null)
    const { token } = useAuthContext()
    const { courseId } = useParams()
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [isLoading, setIsLoading] = useState(false)
    const [videoPath, setVideoPath] = useState("")

    const [outcome, setOutcome] = useState("")
    const [lesson, setLesson] = useState({
        _id: "",
        title: "",
        content: "",
        resource_link: "",
        type: "new",
    })

    const [resMsg, setResMsg] = useState({
        title: "",
        msg: "",
        status: "",
    })

    useEffect(() => {
        const fetchCourse = async () => {
            console.log("ran useEffect")
            const localCourseString = localStorage.getItem("currentCourse")
            const localCourse = JSON.parse(localCourseString)

            if (!localCourse || localCourse._id != courseId) {
                const res = await fetch(`/api/courses/${courseId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                const json = await res.json()
                if (json.status) {
                    setCourse(json.data)
                    localStorage.setItem("currentCourse", JSON.stringify(json.data))
                }
            } else {
                setCourse(localCourse)
            }
        }

        if (token) {
            fetchCourse()
        }
    }, [token])

    const handleChange = (e) => {
        const { name, value } = e.target
        setCourse((prev) => ({ ...prev, [name]: value }))
    }

    const addLearningOutcome = () => {
        if (outcome == "") return
        setCourse((prev) => ({ ...prev, learningOutcomes: [...prev.learningOutcomes, outcome] }))
        setOutcome("")
    }

    const removeLearningOutcome = (i) => {
        setCourse((prev) => ({
            ...prev,
            learningOutcomes: [...prev.learningOutcomes.filter((outcome, index) => i != index)],
        }))
    }

    const handleLessons = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.target)
        try {
            let fileName = ""
            if (videoPath != "") {
                const res = await fetch(`/api/videos/upload-video?courseId=${course._id}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                })
                const json = await res.json()

                if (json.status) {
                    fileName = json.data.fileName
                }
            }

            let updatedLessons
            if (lesson.type == "new") {
                updatedLessons = [
                    ...course.lessons,
                    {
                        title: lesson.title,
                        content: lesson.content,
                        resource_link: fileName,
                    },
                ]
            } else {
                updatedLessons = [
                    ...course.lessons.map((les) =>
                        les._id == lesson._id
                            ? {
                                  ...les,
                                  title: lesson.title,
                                  content: lesson.content,
                                  resource_link: videoPath == "" ? les.resource_link : fileName,
                              }
                            : les
                    ),
                ]
            }

            localStorage.setItem(
                "currentCourse",
                JSON.stringify({ ...course, lessons: updatedLessons })
            )

            setCourse((prev) => ({
                ...prev,
                lessons: updatedLessons,
            }))
            setVideoPath("")
        } catch (error) {
            setIsLoading(false)
        }

        setIsLoading(false)
    }

    const updateCourse = async (e) => {
        setIsLoading(true)
        e.preventDefault()
        setResMsg({
            title: "",
            msg: "",
            status: "",
        })

        const updatedCourse = new FormData(e.target)
        if (updatedCourse.get("type") == "free") {
            updatedCourse.set("price", 0)
        }
        updatedCourse.append("learningOutcomes", JSON.stringify(course.learningOutcomes))
        updatedCourse.append("lessons", JSON.stringify(course.lessons))

        const res = await fetch(`/api/courses/${courseId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: updatedCourse,
        })

        const json = await res.json()

        if (json.status) {
            localStorage.setItem("currentCourse", JSON.stringify(json.data))
            setCourse(json.data)
            setResMsg({ title: "Success", msg: json.message, status: "success" })
        } else {
            setResMsg({ title: "Error", msg: json.error, status: "error" })
        }

        setIsLoading(false)
    }

    const changeContent = (content) => {
        setLesson((prev) => ({
            ...prev,
            content,
        }))
    }

    return (
        <Container minWidth="60vw" p="5">
            {course && (
                <>
                    <form onSubmit={updateCourse}>
                        <Flex>
                            <Heading flex="1">Edit Course</Heading>
                            <Button type="submit" variant="solid" colorScheme="blue">
                                {isLoading ? <Spinner /> : "Save"}
                            </Button>
                        </Flex>

                        {resMsg.status != "" && (
                            <Alert status={resMsg.status}>
                                <AlertIcon />
                                <Box>
                                    <AlertTitle>{resMsg.title}</AlertTitle>
                                    <AlertDescription>{resMsg.msg}</AlertDescription>
                                </Box>
                            </Alert>
                        )}
                        <FormControl>
                            <FormLabel>Name: </FormLabel>
                            <Input
                                name="name"
                                type="text"
                                onChange={handleChange}
                                value={course.name}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Thumbnail: </FormLabel>
                            <Input name="photo" type="file" />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Summary: </FormLabel>
                            <Input
                                name="summary"
                                type="text"
                                onChange={handleChange}
                                value={course.summary}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Category: </FormLabel>
                            <Input
                                name="category"
                                type="text"
                                onChange={handleChange}
                                value={course.category}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>Desciption : </FormLabel>
                            <Textarea
                                name="description"
                                onChange={handleChange}
                                value={course.description}
                            ></Textarea>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Free/Paid</FormLabel>
                            <Select
                                name="type"
                                value={course.type}
                                onChange={handleChange}
                                defaultValue={"free"}
                            >
                                <option value="free">Free</option>
                                <option value="paid">Paid</option>
                            </Select>
                        </FormControl>

                        {course.type == "paid" && (
                            <FormControl>
                                <FormLabel>Price</FormLabel>
                                <Input name="price" onChange={handleChange} value={course.price} />
                            </FormControl>
                        )}

                        <Text fontSize="30px">Leaning Outcomes</Text>
                        <List>
                            {course.learningOutcomes.map((outcome, index) => (
                                <ListItem key={index} display="flex" my="1">
                                    <Text flex="1">
                                        <ListIcon as={StarIcon} color="blue.600" />
                                        {outcome}
                                    </Text>
                                    <IconButton
                                        onClick={() => removeLearningOutcome(index)}
                                        size="sm"
                                        colorScheme="blue"
                                        icon={<DeleteIcon />}
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <FormControl my="3">
                            <Input
                                type="text"
                                value={outcome}
                                onChange={(e) => setOutcome(e.target.value)}
                                mb="3"
                            />
                            <Button colorScheme="blue" onClick={addLearningOutcome}>
                                Add Outcome
                            </Button>
                        </FormControl>

                        <VStack align="stretch">
                            <Flex>
                                <Heading flex="1">Lessons</Heading>
                                {!course.published && (
                                    <Button
                                        colorScheme="blue"
                                        minWidth="180px"
                                        onClick={() => {
                                            setLesson({
                                                _id: "",
                                                title: "",
                                                content: "",
                                                resource_link: "",
                                                type: "new",
                                            })
                                            onOpen()
                                        }}
                                    >
                                        Add Lesson
                                    </Button>
                                )}
                            </Flex>

                            {course.lessons.map((currentLesson, index) => (
                                <Container key={index + 1} minWidth="60vw">
                                    <HStack>
                                        <Avatar
                                            name={`${index + 1}`}
                                            color="whitesmoke"
                                            bgColor="blue.500"
                                        />
                                        <Text flex="1">{currentLesson.title}</Text>
                                        <IconButton
                                            icon={<EditIcon />}
                                            colorScheme="blue"
                                            onClick={() => {
                                                setLesson({
                                                    _id: currentLesson._id,
                                                    title: currentLesson.title,
                                                    content: currentLesson.content,
                                                    resource_link: currentLesson.resource_link,
                                                    type: "update",
                                                })
                                                onOpen()
                                            }}
                                        />
                                    </HStack>
                                    <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                                </Container>
                            ))}
                        </VStack>
                    </form>
                    <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>
                                {lesson.type == "new" && "Add"}
                                {lesson.type == "update" && "Update"} Lesson
                                <ModalCloseButton />
                            </ModalHeader>
                            <form onSubmit={handleLessons}>
                                <ModalBody>
                                    <FormControl>
                                        <FormLabel>Title</FormLabel>
                                        <Input
                                            type="text"
                                            value={lesson.title}
                                            onChange={(e) =>
                                                setLesson((prev) => ({
                                                    ...prev,
                                                    title: e.target.value,
                                                }))
                                            }
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Video Tutorial</FormLabel>
                                        <Input
                                            type="file"
                                            name="courseVideo"
                                            value={videoPath}
                                            onChange={(e) => setVideoPath(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Content</FormLabel>

                                        <TextEditor
                                            content={lesson.content}
                                            changeContent={changeContent}
                                        />
                                    </FormControl>
                                </ModalBody>
                                <ModalFooter>
                                    <Button mr="3" minWidth="32" onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="solid"
                                        colorScheme="blue"
                                        type="submit"
                                        minWidth="180px"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Spinner />
                                        ) : lesson.type == "new" ? (
                                            "Add"
                                        ) : (
                                            "Update"
                                        )}
                                    </Button>
                                </ModalFooter>
                            </form>
                        </ModalContent>
                    </Modal>
                </>
            )}
        </Container>
    )
}

export default EditCourse
