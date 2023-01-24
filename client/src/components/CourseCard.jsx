import { Box, Flex, Heading, Img, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

const CourseCard = ({ course, linkTo }) => {
    return (
        <Link to={linkTo}>
            <Flex
                bgColor="white"
                borderBottom="1px solid whitesmoke"
                _hover={{ backgroundColor: "whitesmoke" }}
                style={{ border: "1px solid #c6c6c6", borderRadius: "10px" }}
                my="2"
            >
                <Img
                    objectFit="cover"
                    src={`/img/courses/${course.photo}`}
                    alt={course.name}
                    p="3"
                    borderRadius="25"
                    width="300px"
                    height="190px"
                />
                <Box flex="1" p="3">
                    <Flex direction="column" gap="3">
                        <Heading as="h5" fontSize="36">
                            {course.name}
                        </Heading>
                        <Heading as="h5" fontSize="20">
                            {course.lessons.length} lessons
                        </Heading>
                        <Text fontSize="lg">{course.summary}</Text>
                    </Flex>
                </Box>
            </Flex>
        </Link>
    )
}

export default CourseCard
