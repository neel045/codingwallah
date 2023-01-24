import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    useColorModeValue,
    Image,
    Avatar,
    HStack,
    Center,
    MenuButton,
    MenuList,
    MenuItem,
    Menu,
    FormControl,
    Input,
} from "@chakra-ui/react"

import Logo from "../assets/codingwallah.png"
import { Link, useLocation, useNavigate } from "react-router-dom"
import useAuthContext from "../hooks/useAuthContext"
import useLogout from "../hooks/useLogout"
import { useState } from "react"

const Navbar = () => {
    const { user } = useAuthContext()
    const { logout } = useLogout()
    const location = useLocation()
    const navigate = useNavigate()

    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = (e) => {
        e.preventDefault()
        navigate(`/?searchQuery=${searchQuery}`)
    }

    return (
        <Box as="section" display={location.pathname.includes("/enrollments") && "none"}>
            <Box as="nav" bg="ghostwhite" boxShadow={useColorModeValue("sm", "sm-dark")}>
                <Flex justify="space-evenly" alignItems="center">
                    <Link to="/">
                        <Image src={Logo} boxSize="16" width="auto" />
                    </Link>

                    {user && (
                        <form onSubmit={handleSearch}>
                            <Flex>
                                <FormControl>
                                    <Input
                                        placeholder="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </FormControl>
                                <Button ml="2" type="submit" variant="solid" colorScheme="blue">
                                    Search
                                </Button>
                            </Flex>
                        </form>
                    )}
                    <ButtonGroup variant="link" spacing="14" width="100" px="2">
                        {user && (
                            <Menu direction="ltr">
                                <MenuButton>
                                    <Avatar src={`/img/users/${user.photo}`} />
                                </MenuButton>

                                <MenuList>
                                    <MenuItem>
                                        <Link to={`/profile/${user._id}`}>Account</Link>
                                    </MenuItem>
                                    {user.isEducator && (
                                        <MenuItem>
                                            <Link to="/teach/courses">Teach</Link>
                                        </MenuItem>
                                    )}
                                    <MenuItem>
                                        <Link to="/my-enrollments">My Enrollments</Link>
                                    </MenuItem>
                                    <MenuItem onClick={logout}>Sign Out</MenuItem>
                                </MenuList>
                            </Menu>
                        )}
                        {!user && (
                            <>
                                <Button>
                                    <Link style={{ padding: "30px 0px" }} to="/auth">
                                        Login/Signup
                                    </Link>
                                </Button>
                            </>
                        )}
                    </ButtonGroup>
                </Flex>
            </Box>
        </Box>
    )
}

export default Navbar
