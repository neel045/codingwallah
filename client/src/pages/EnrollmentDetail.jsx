import {
    Box,
    Button,
    Container,
    Divider,
    Flex,
    Grid,
    GridItem,
    Heading,
    Progress,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from "@chakra-ui/react"
import { useState } from "react"
import { useEffect } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import VideoPlayer from "../components/videoPlayer"
import useAuthContext from "../hooks/useAuthContext"
import ReactMarkdown from "react-markdown"

const EnrollmentDetail = () => {
    const { user, token, dispatch, enrollments: userEnrollments } = useAuthContext()
    const { enrollmentId } = useParams()
    const [enrollment, setEnrollment] = useState()
    const [searchParams, setSearchParams] = useSearchParams()
    const [currentLesson, setCurrentLesson] = useState()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setEnrollment(userEnrollments.filter((enrollment) => enrollment._id == enrollmentId)[0])
        if (enrollment) {
            handleLinks()
        }
    }, [enrollment, userEnrollments])

    useEffect(() => {
        if (enrollment) {
            handleLinks()
        }
    }, [searchParams])

    const handleLinks = () => {
        setCurrentLesson({
            ...enrollment.course.lessons.filter(
                (lesson) => lesson._id == searchParams.get("lesson")
            )[0],
            complete: enrollment.lessonStatus.filter(
                (lesson) => lesson.lesson == searchParams.get("lesson")
            )[0].complete,
            progress:
                (enrollment.lessonStatus.filter((lesson) => lesson.complete == true).length /
                    enrollment.lessonStatus.length) *
                100,
        })
    }

    const completeLesson = async () => {
        if (currentLesson.complete) {
            return
        }

        setIsLoading(true)
        const res = await fetch(`/api/enrollment/complete-lesson/${enrollment._id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                lesson: currentLesson._id,
            }),
        })

        const json = await res.json()
        if (json.status) {
            const updatedEnrollments = userEnrollments.map((enrollment) =>
                enrollment._id == json.data._id ? { ...json.data } : enrollment
            )
            localStorage.setItem(
                "user",
                JSON.stringify({ user, token, enrollments: updatedEnrollments })
            )
            dispatch({
                type: "SET_ENROLLMENTS",
                payload: {
                    enrollments: updatedEnrollments,
                },
            })
        }

        setIsLoading(false)
    }

    return (
        <>
            {enrollment && enrollment._id && (
                <Grid
                    templateAreas={`"header header"
            "main nav"`}
                    gridTemplateRows={"60px 1fr"}
                    gridTemplateColumns={"1fr 30vw"}
                    height="98vh"
                >
                    <GridItem area="header" color="white" bgColor="#333">
                        <Link to={`/courses/${enrollment.course._id}`}>
                            <Heading as="h5" fontSize="2xl" p="1.5">
                                {enrollment.course.name}
                            </Heading>
                        </Link>
                    </GridItem>
                    <GridItem area={"main"} bgColor="whitesmoke" overflowY="scroll" p="3">
                        {currentLesson && (
                            <Box>
                                <Flex>
                                    <Heading flex="1" as="h2" fontSize="2xl">
                                        {currentLesson.title}
                                    </Heading>
                                    <Button
                                        colorScheme="twitter"
                                        onClick={completeLesson}
                                        disabled={isLoading}
                                        minW="36"
                                    >
                                        {isLoading ? (
                                            <Spinner />
                                        ) : currentLesson.complete ? (
                                            "Completed"
                                        ) : (
                                            "Complete"
                                        )}
                                    </Button>
                                </Flex>
                                {currentLesson.resource_link && (
                                    <VideoPlayer
                                        videoUrl={`/api/videos/stream/${currentLesson.resource_link}?token=${token}`}
                                    />
                                )}

                                <Tabs>
                                    <TabList>
                                        <Tab>About</Tab>
                                        <Tab>Instructor</Tab>
                                    </TabList>

                                    <TabPanels>
                                        <TabPanel>
                                            <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                                        </TabPanel>
                                        <TabPanel>Author</TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </Box>
                        )}
                    </GridItem>

                    <GridItem area={"nav"} bgColor="whitesmoke" overflowY="scroll" p="3">
                        {currentLesson && (
                            <Box fontSize={"24"}>
                                <Text>COURSE PROGRESS</Text>
                                <Container display="flex" alignItems="center">
                                    <Progress
                                        colorScheme="blue"
                                        value={currentLesson.progress}
                                        flex="1"
                                        mr="1"
                                    />
                                    <Text>{Math.round(currentLesson.progress)}%</Text>
                                </Container>
                            </Box>
                        )}
                        {enrollment.course.lessons.map((lesson, index) => (
                            <Box key={index} fontSize="24" borderBottom="2px solid white" m="3">
                                <Link to={`/enrollments/${enrollment._id}?lesson=${lesson._id}`}>
                                    {`${index + 1}. ${lesson.title}`}
                                </Link>
                            </Box>
                        ))}
                    </GridItem>
                </Grid>
            )}
        </>
    )
}

export default EnrollmentDetail
