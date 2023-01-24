import { AddIcon } from "@chakra-ui/icons"
import { Button, Container, Heading, HStack, Image, Img, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import CourseCard from "../components/CourseCard"
import useAuthContext from "../hooks/useAuthContext"

const Teach = () => {
    const { user, token } = useAuthContext()
    const [courses, setCourses] = useState(null)

    useEffect(() => {
        const fetchCourses = async () => {
            console.log("fetched")
            const res = await fetch(`/api/courses/by/${user._id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const json = await res.json()
            console.log(json)

            if (json.status) {
                setCourses(json.data)
            }
        }
        if (user && user._id) {
            fetchCourses()
        }
    }, [token])

    return (
        <Container minWidth="60vw">
            <HStack my="2">
                <Heading flex="1">My Courses</Heading>
                <Button variant="solid" colorScheme="blue" leftIcon={<AddIcon />}>
                    <Link to="/teach/courses/new">New Courses</Link>
                </Button>
            </HStack>

            {courses &&
                courses.map((course) => (
                    <CourseCard
                        course={course}
                        key={course._id}
                        linkTo={`/courses/${course._id}`}
                    ></CourseCard>
                ))}
        </Container>
    )
}

export default Teach
