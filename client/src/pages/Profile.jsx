import {
    Avatar,
    Button,
    ButtonGroup,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import ChangePassword from "../components/ChangePasswod"
import CourseCard from "../components/CourseCard"
import PaymentDetails from "../components/PaymentDetails"
import UpdateUserProfile from "../components/UpdateUserProfile"
import useAuthContext from "../hooks/useAuthContext"

const Profile = () => {
    const { userId } = useParams()
    const { user, token } = useAuthContext()
    const [userProfile, setUserProfile] = useState(null)
    const [courses, setCourses] = useState(null)
    const [currentTab, setCurrentTab] = useState("courses")

    useEffect(() => {
        const fetchUser = async () => {
            if (userId != user._id) {
                const res = await fetch(`/api/users/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const json = await res.json()

                if (json.status) {
                    if (json.data.isEducator) {
                        fetchCoursesByAccount(json.data)
                    } else {
                        setCourses(null)
                    }
                    setUserProfile(json.data)
                }
            } else {
                if (user.isEducator) {
                    fetchCoursesByAccount(user)
                } else {
                    setCourses(null)
                }
                setUserProfile(user)
            }
        }

        const fetchCoursesByAccount = async (user) => {
            const res = await fetch(`/api/courses/by/${user._id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const json = await res.json()

            if (json.status) {
                setCourses(json.data)
            } else {
                setCourses(null)
            }
        }
        fetchUser()
    }, [userId, user])

    return (
        <Grid templateAreas={`"sidebar main nav"`} gridTemplateColumns={"1fr 3fr 1fr "}>
            {userProfile && userProfile._id == user._id && (
                <GridItem area="sidebar">
                    <ButtonGroup variant="link" colorScheme="blue">
                        <Flex
                            flexDirection="column"
                            // bgColor="blackAlpha.200"
                            alignItems="flex-start"
                            pl="10"
                            height="30vh"
                            justify="center"
                        >
                            <Button fontSize="2xl" onClick={() => setCurrentTab("courses")}>
                                Home
                            </Button>
                            <Button fontSize="2xl" onClick={() => setCurrentTab("account")}>
                                Account Details
                            </Button>
                            <Button fontSize="2xl" onClick={() => setCurrentTab("change-password")}>
                                Change Password
                            </Button>
                            {userProfile.isEducator && (
                                <Button
                                    fontSize="2xl"
                                    onClick={() => setCurrentTab("payment-details")}
                                >
                                    Payment Details
                                </Button>
                            )}
                        </Flex>
                    </ButtonGroup>
                </GridItem>
            )}
            <GridItem area="main">
                <Container minWidth="60vw">
                    {userProfile && (userProfile.isEducator || userId == user._id) ? (
                        <>
                            <Flex gap="10">
                                <Avatar
                                    src={`/img/users/${userProfile.photo}`}
                                    name={userProfile.name}
                                    boxSize="200"
                                    boxShadow="rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
                                />
                                <VStack spacing={4} align="flex-start" mt="4">
                                    <Heading as="h3" fontSize="34">
                                        {userProfile._id == userId && "Name: "}
                                        {userProfile.name}
                                    </Heading>
                                    {userProfile._id == userId && (
                                        <Text fontSize="28">Email: {userProfile.email}</Text>
                                    )}
                                    {userProfile.isEducator && <Text>{userProfile.about}</Text>}
                                </VStack>
                            </Flex>

                            <Container mt="3" minWidth="inherit">
                                {currentTab == "courses" && (
                                    <>
                                        {userProfile.isEducator && (
                                            <Heading my="4" color="blue.600">
                                                Courses Offered
                                            </Heading>
                                        )}
                                        {courses &&
                                            courses.map((course) => (
                                                <CourseCard
                                                    course={course}
                                                    key={course._id}
                                                    linkTo={`/courses/${course._id}`}
                                                />
                                            ))}
                                    </>
                                )}

                                {currentTab == "change-password" && <ChangePassword />}
                                {currentTab == "account" && <UpdateUserProfile />}
                                {currentTab == "payment-details" && <PaymentDetails />}
                            </Container>
                        </>
                    ) : (
                        <Container>
                            <Heading>No Profile Found</Heading>
                        </Container>
                    )}
                </Container>
            </GridItem>
        </Grid>
    )
}

export default Profile
