import { Button, Container, Flex, Heading, Text, VStack } from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons"
import { useEffect } from "react"
import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import CourseCard from "../components/CourseCard"
import useAuthContext from "../hooks/useAuthContext"
const Home = () => {
    const { user, token, enrollments, dispatch } = useAuthContext()
    const [courses, setCourses] = useState([])
    const [searchQuery, setSearchQuery] = useSearchParams()

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch(`/api/courses?limit=${5}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                const json = await res.json()
                if (json.status) {
                    setCourses(json.data)
                } else {
                    setCourses([])
                }
            } catch (error) {
                console.log(error)
            }
        }
        const searchCourses = async () => {
            if (searchQuery.get("searchQuery") == "" || searchQuery.get("searchQuery") == null) {
                fetchCourses()
                return
            }
            try {
                const res = await fetch(
                    `/api/courses/search?searchQuery=${searchQuery.get("searchQuery")}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                const json = await res.json()
                if (json.status) {
                    setCourses(json.data)
                } else {
                    setCourses([])
                }
            } catch (error) {
                console.log(error)
            }
        }

        searchCourses()
    }, [searchQuery])

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const res = await fetch(`/api/enrollment/enrolled`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                const json = await res.json()
                console.log(json)
                if (json.status) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify({ user, token, enrollments: json.data })
                    )
                    dispatch({ type: "SET_ENROLLMENTS", payload: { enrollments: json.data } })
                }
            } catch (error) {
                console.log(error)
            }
        }

        if (token) {
            try {
                if (!enrollments) {
                    fetchEnrollments()
                }
            } catch (error) {
                console.log(error)
            }
        }
    }, [token])

    return (
        <>
            <VStack
                align="flex-start"
                color="whitesmoke"
                p="4"
                bgGradient="linear(to-r, blue.400, blue.700)"
                pl="80"
                textShadow="3px 3px 2px rgba(16, 0, 161, 1)"
                mt="0"
            >
                <Text fontSize="2xl">Hi {user.name},</Text>
                <Heading fontSize="3xl">Welcome to CodingWallah</Heading>
            </VStack>
            {enrollments && (
                <Container maxWidth="60vw" mt="4">
                    <Flex p="2">
                        <Heading fontSize="32px" flex="1">
                            Continue Learning
                        </Heading>
                        <Button variant="solid" colorScheme="blue">
                            <Link to="/my-enrollments">
                                My Enrollments <ArrowForwardIcon />
                            </Link>
                        </Button>
                    </Flex>
                    {enrollments && (
                        <CourseCard
                            course={enrollments[0].course}
                            linkTo={
                                enrollments[0].paid || enrollments[0].course.type == "free"
                                    ? `/enrollments/${enrollments[0]._id}?lesson=${enrollments[0].course.lessons[0]._id}`
                                    : `/courses/${enrollments[0].course._id}`
                            }
                        />
                    )}
                </Container>
            )}
            {courses.length != 0 && (
                <Container minWidth="60vw">
                    <Heading mt="4">Courses</Heading>

                    {courses.map((course) => (
                        <CourseCard
                            course={course}
                            key={course._id}
                            linkTo={`/courses/${course._id}`}
                        />
                    ))}
                </Container>
            )}
        </>
    )
}

export default Home
