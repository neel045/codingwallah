import { Container, Heading, Input } from "@chakra-ui/react"
import { useState } from "react"
import { useEffect } from "react"
import CourseCard from "../components/CourseCard"
import useAuthContext from "../hooks/useAuthContext"

const MyEnrollments = () => {
    const { user, token, enrollments: userEnrollments, dispatch } = useAuthContext()
    const [enrollments, setEnrollments] = useState(userEnrollments)

    useEffect(() => {
        const fetchEnrollments = async () => {
            const res = await fetch(`/api/enrollment/enrolled`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const json = await res.json()

            if (json.status) {
                localStorage.setItem(
                    "user",
                    JSON.stringify({ user, token, enrollments: json.data })
                )
                dispatch({ type: "SET_ENROLLMENTS", payload: { enrollments: json.data } })
            }
        }

        if (token) fetchEnrollments()
        console.log("ran useeffect")
    }, [token])

    const searchCourse = (e) => {
        e.preventDefault()
        const searchInput = e.target.value

        if (searchInput.length == 0) {
            setEnrollments(userEnrollments)
            return
        }
        const seartchQueries = searchInput.split(" ").filter((item) => item != "")

        const results = userEnrollments.filter((enrollment) =>
            seartchQueries.some((item) =>
                enrollment.course.name.toLowerCase().includes(item.toLowerCase())
            )
        )
        setEnrollments(results)
    }

    return (
        <Container minWidth="70vw">
            <Heading>Courses</Heading>
            <Input type="text" placeholder="Search Course" my="3" onChange={searchCourse} />
            {enrollments &&
                enrollments.map((enrollment) => (
                    <CourseCard
                        key={enrollment._id}
                        course={enrollment.course}
                        linkTo={
                            enrollment.paid || enrollment.course.type == "free"
                                ? `/enrollments/${enrollment._id}?lesson=${enrollment.course.lessons[0]._id}`
                                : `/courses/${enrollment.course._id}`
                        }
                    />
                ))}

            {!enrollments && (
                <Heading as="h6" fontSize="34">
                    No Enrollments, Start Learning
                </Heading>
            )}
        </Container>
    )
}

export default MyEnrollments
