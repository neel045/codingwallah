import { AddIcon, CheckCircleIcon, EditIcon, LockIcon, UnlockIcon } from "@chakra-ui/icons"
import {
    Alert,
    AlertDescription,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertIcon,
    AlertTitle,
    Avatar,
    Box,
    Button,
    Card,
    CardBody,
    Code,
    Container,
    Flex,
    Heading,
    HStack,
    IconButton,
    Img,
    List,
    ListIcon,
    ListItem,
    Spinner,
    Text,
    useDisclosure,
    VStack,
} from "@chakra-ui/react"
import { formatDistanceToNow, format } from "date-fns"
import { useEffect } from "react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import useAuthContext from "../hooks/useAuthContext"

const CourseDetail = () => {
    const [course, setCourse] = useState(null)
    const { courseId } = useParams()
    const { user, token, enrollments, dispatch } = useAuthContext()
    const { isOpen, onClose, onOpen } = useDisclosure()
    const [resMsg, setResMsg] = useState({ status: "", title: "", msg: "" })
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [isEnrolled, setIsEnrolled] = useState({
        enrolled: false,
        _id: "",
        firstLesson: "",
        paid: false,
    })

    useEffect(() => {
        const fetchCourse = async () => {
            const res = await fetch(`/api/courses/${courseId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const json = await res.json()
            if (json.status) {
                if (enrollments) {
                    enrollments.forEach((enrollment) => {
                        if (enrollment.course._id == json.data._id) {
                            setIsEnrolled({
                                enrolled: true,
                                _id: enrollment._id,
                                firstLesson: enrollment.lessonStatus[0].lesson,
                                paid: enrollment.paid,
                            })
                        }
                    })
                }
                setCourse(json.data)
            }
        }

        const fetchStats = async () => {
            const res = await fetch(`/api/enrollment/stats/${courseId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const json = await res.json()
            if (json.status) {
                setCourse((prev) => ({ ...prev, ...json.data }))
            }
        }

        if (token) {
            fetchCourse()
            fetchStats()
        }
    }, [token, courseId])

    const enrollCourse = async () => {
        setIsLoading(true)
        if (isEnrolled.enrolled && isEnrolled.paid) {
            navigate(`/enrollments/${isEnrolled._id}?lesson=${isEnrolled.firstLesson}`)
            return
        }

        const res = await fetch(`/api/enrollment/new/${course._id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const json = await res.json()

        if (course.type == "free" && json.status) {
            setIsEnrolled({
                enrolled: true,
                _id: json.data._id,
                firstLesson: json.data.lessonStatus[0].lesson,
                paid: true,
            })
            const updatedEnrollments = enrollments ? [...enrollments, json.data] : [json.data]
            localStorage.setItem(
                "user",
                JSON.stringify({ user, token, enrollments: updatedEnrollments })
            )
            dispatch({ type: "SET_ENROLLMENTS", payload: { enrollments: updatedEnrollments } })
            setIsLoading(false)
            return
        }

        if (json.status) {
            const { order } = json.data
            const options = {
                key: "rzp_test_h6EKfnEQvcCZd7",
                amount: order.amount,
                currency: "INR",
                name: "CodingWallah",
                description: "Buy course",
                image: "http://localhost:5173/src/assets/codingwallah.png",
                order_id: order.id,
                callback_url: "http://localhost:5000/api/enrollment/payment-verification",
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                notes: {
                    address: "Razorpay Corporate Office",
                },
                theme: {
                    color: "#3399cc",
                },
            }

            const razor = new Razorpay(options)
            razor.open()
        }
        setIsLoading(false)
    }

    const publishCourse = async () => {
        setIsLoading(true)
        setResMsg({ status: "", title: "", msg: "" })
        const res = await fetch(`/api/courses/${course._id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ published: true }),
        })

        const json = await res.json()

        if (json.status) {
            setResMsg({ status: "success", title: "Success", msg: json.message })
            setCourse((prev) => ({ ...prev, ...json.data }))
        } else {
            setResMsg({ status: "error", title: "Error", msg: json.error })
        }
        setIsLoading(false)
        onClose()
        setTimeout(() => setResMsg({ status: "", title: "", msg: "" }), 1500)
    }

    return course ? (
        <Container minWidth="60vw" backgroundColor="whitesmoke" p="5">
            {resMsg.status != "" && (
                <Alert status={resMsg.status} mt="3">
                    <AlertIcon />
                    <AlertTitle>{resMsg.title}</AlertTitle>
                    <AlertDescription>{resMsg.msg}</AlertDescription>
                </Alert>
            )}
            {course && course.instructor._id == user._id && (
                <Flex>
                    <Box flex="1"></Box>

                    <Link to={`/teach/courses/edit/${course._id}`}>
                        <Button variant="solid" colorScheme="blue" leftIcon={<EditIcon />}>
                            Edit
                        </Button>
                    </Link>
                    {!course.published && (
                        <Button mx="3" variant="solid" colorScheme="blue" onClick={onOpen}>
                            Publish
                        </Button>
                    )}
                    <AlertDialog isOpen={isOpen} onClose={onClose}>
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader>Publish Course</AlertDialogHeader>
                                <AlertDialogBody>
                                    <strong>
                                        Once You publish course you wont't be able to add new
                                        lessons
                                    </strong>
                                    , you can only update lessons.
                                    <br /> Are you sure You really want to publish this course ?
                                </AlertDialogBody>
                                <AlertDialogFooter>
                                    <Button
                                        variant="solid"
                                        colorScheme="blue"
                                        onClick={publishCourse}
                                        disabled={isLoading}
                                        mr="3"
                                    >
                                        {isLoading ? <Spinner /> : "Publish"}
                                    </Button>
                                    <Button onClick={onClose}>Cancel</Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </Flex>
            )}

            <Flex mt="4">
                <Container flex="1">
                    <Text flex="1" fontSize="4xl" fontWeight="medium">
                        {course.name}
                    </Text>
                    <Text fontSize="24px" fontWeight="light">
                        {course.summary}
                    </Text>

                    <Text>Student Enrollred {course.totalEnrolled}</Text>
                    <Text>Completed: {course.totalCompleted}</Text>

                    <Text>
                        By
                        <Button variant="link" ml="4">
                            <Link to={`/profile/${course.instructor._id}`}>
                                {course.instructor.name}
                            </Link>
                        </Button>
                    </Text>

                    <Code
                        fontSize="1xl"
                        fontWeight="light"
                        colorScheme="cyan"
                        px="3"
                        borderRadius="10px"
                    >
                        {course.category}
                    </Code>

                    <Text>Created At: {format(new Date(course.createdAt), "dd MMM yyyy")}</Text>
                    <Text>
                        updated :{" "}
                        {formatDistanceToNow(new Date(course.updatedAt), { addSuffix: true })}
                    </Text>
                </Container>

                <Card maxW="sm">
                    <CardBody>
                        <Img
                            src={`/img/courses/${course.photo}`}
                            objectFit="cover"
                            maxW={{ base: "100%", sm: "300px" }}
                        />
                        <Text fontWeight="medium" fontSize="2xl" mt="3">
                            {course.type == "paid" ? `₹${course.price}` : "Free"}
                        </Text>
                        <Button
                            variant="solid"
                            colorScheme="blue"
                            my="2"
                            minWidth="300px"
                            onClick={enrollCourse}
                            disabled={isLoading}
                            leftIcon={(!isEnrolled.enrolled || !isEnrolled.paid) && <UnlockIcon />}
                        >
                            {isLoading ? (
                                <Spinner />
                            ) : isEnrolled.enrolled ? (
                                isEnrolled.paid ? (
                                    "Go To Dashboard"
                                ) : (
                                    "Complete Payment"
                                )
                            ) : course.type == "free" ? (
                                "Enroll Now"
                            ) : (
                                "Buy Now"
                            )}
                        </Button>
                        <Text fontWeight="medium" fontSize="2xl">
                            What's Included ?
                        </Text>
                        <Text fontSize="1xl">
                            <AddIcon fontSize="1xl" /> {course.lessons.length} lessons
                        </Text>
                        <Text fontSize="1xl">
                            <CheckCircleIcon fontSize="1xl" /> Online Accecibility
                        </Text>
                        <Text fontSize="2xl"></Text>
                    </CardBody>
                </Card>
            </Flex>

            <VStack justify="flex-start" align="stretch">
                <Text fontSize="2xl">What Will You Learn ?</Text>
                <List>
                    {course.learningOutcomes.map((outcome, index) => (
                        <ListItem key={index}>
                            <ListIcon as={CheckCircleIcon} color="green.600" />
                            {outcome}
                        </ListItem>
                    ))}
                </List>
                <Heading as="h6" fontSize="2xl">
                    Description
                </Heading>
                <Text>{course.description}</Text>
            </VStack>

            <VStack align="stretch" overflowY="scroll">
                <Heading>Lessons</Heading>
                {course.lessons.map((lesson, index) => (
                    <Container key={lesson._id}>
                        <HStack>
                            <Avatar name={`${index + 1}`} color="whitesmoke" bgColor="blue.500" />
                            <Text flex="1">{lesson.title}</Text>
                        </HStack>
                    </Container>
                ))}
            </VStack>
        </Container>
    ) : (
        <Heading>Not Found</Heading>
    )
}

export default CourseDetail
