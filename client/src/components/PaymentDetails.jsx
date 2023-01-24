import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
} from "@chakra-ui/react"
import { useState } from "react"

const PaymentDetails = () => {
    const [paymentDetails, setPaymentDetails] = useState({})
    const [resMsg, setResMsg] = useState({
        status: "",
        msg: "",
        title: "",
    })

    const handleChange = (e) => {}

    const handleSubmit = (e) => {}

    return (
        <Box>
            <Heading color="blue.500">Payment Details</Heading>

            <Heading as="h4">Coming Soon</Heading>

            {/* <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input value={paymentDetails.name} onChange={handleChange} type="text" />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input value={paymentDetails.email} onChange={handleChange} type="text" />
                </FormControl>

                <Button my="3" variant="solid" colorScheme="blue" type="submit">
                    Submit
                </Button>

                {resMsg.status != "" && (
                    <Alert status={resMsg.status} mt="3">
                        <AlertIcon />
                        <AlertTitle>{resMsg.title}</AlertTitle>
                        <AlertDescription>{resMsg.msg}</AlertDescription>
                    </Alert>
                )}
            </form> */}
        </Box>
    )
}

export default PaymentDetails
