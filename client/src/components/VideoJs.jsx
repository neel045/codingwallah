import { useEffect, useRef } from "react"
import videojs from "video.js"
import useAuthContext from "../hooks/useAuthContext"
import "video.js/dist/video-js.css"

const VideoJs = ({ videoOptions, onReady }) => {
    const { token } = useAuthContext()
    const videoRef = useRef(null)
    const playerRef = useRef(null)

    useEffect(() => {
        if (!playerRef.current) {
            const videoElement = document.createElement("video-js")
            videoElement.classList.add("vjs-big-play-centered")
            videoRef.current.appendChild(videoElement)

            playerRef.current = videojs(videoElement, videoOptions, () => {
                videojs.log("player is ready")
                onReady && onReady(player)
            })
            const player = playerRef.current
        } else {
            const player = playerRef.current
            console.log(player)
            player.autoplay(videoOptions.autoplay)
            player.src(videoOptions.sources)
        }
    }, [videoOptions, videoRef])

    useEffect(() => {
        const player = playerRef.current
        return () => {
            if (player && player.isDisposed()) {
                player.dispose()
                playerRef.current = null
            }
        }
    }, [playerRef])

    return (
        <div data-vjs-player>
            <div ref={videoRef} />
        </div>
    )
}

export default VideoJs
