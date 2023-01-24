import { useRef } from "react"
import VideoJs from "./VideoJs"
import videojs from "video.js"
import "@videojs/http-streaming"
import { Box } from "@chakra-ui/react"
import useAuthContext from "../hooks/useAuthContext"

const VideoPlayer = ({ videoUrl }) => {
    const playerRef = useRef(null)
    const { token } = useAuthContext()

    // xhook.before((req, cb) => {
    //     alert("before")

    //     console.log("ran xhook before")
    //     // if(req.)
    //     req.headers.set("Authorization", `Bearer ${token}`)
    //     console.log(req.headers.get("Authorization"))
    //     cb()
    // })

    const videoOptions = {
        autoplay: false,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
            {
                src: videoUrl,
                type: "video/mp4",
                withCredentials: true,
            },
        ],
        html5: {
            vhs: {
                overrideNative: true,
            },
        },
        Plugin: {},
    }

    const handlePlayerReady = (player) => {
        playerRef.current = player

        player.on("waiting", () => {
            videojs.log("player is waiting")
        })

        player.on("dispose", () => {
            videojs.log("player is disposed")
        })
    }

    return (
        <Box mt="1">
            <VideoJs videoOptions={videoOptions} onReady={handlePlayerReady} />
        </Box>
    )
}

export default VideoPlayer
