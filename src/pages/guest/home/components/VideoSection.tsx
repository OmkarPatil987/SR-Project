import { useState, useRef } from "react";
import { Box, Card, Container, Divider, Typography, Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
//global_media_gallery/1759301169771_video_4.mp4
const mediaItems = [

    {
        type: "video",
        src: "https://relief.choiceconsultancy.co.in/global_media_gallery/1759301169771_video_4.mp4",
        title: "Video One",
    },
    {
        type: "video",
        src: "https://relief.choiceconsultancy.co.in/global_media_gallery/1759242721651_video_one.mp4",
        title: "Video Two",
    },
    {
        type: "video",
        src: "https://relief.choiceconsultancy.co.in/global_media_gallery/1759242733386_video_two.mp4",
        title: "Video Three",
    },
    {
        type: "video",
        src: "https://relief.choiceconsultancy.co.in/global_media_gallery/1759331357549_video_v6.mp4",
        title: "Video four",
    },

    // { type: "image", src: "/images/1.jpeg", title: "Image 1" },
    // { type: "image", src: "/images/3.jpeg", title: "Image 3" },
];

const VideoSection = () => {
    const [openMedia, setOpenMedia] = useState<{ type: string; src: string } | null>(null);
    const carouselVideoRefs = useRef<HTMLVideoElement[]>([]);

    const handleOpenMedia = (item: { type: string; src: string }) => {
        // Pause all carousel videos
        carouselVideoRefs.current.forEach((video) => video && video.pause());
        setOpenMedia(item);
    };

    const handleCloseMedia = () => {
        setOpenMedia(null);
    };

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            { breakpoint: 960, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                <Typography variant="h2" sx={{ fontWeight: 600, color: "#013E5E", textAlign: "center" }}>
                    समाजातील प्रत्येक घटकासाठी आवाहन
                </Typography>
                <Divider sx={{ width: "3%", borderBottomWidth: 4, bgcolor: "#ff5722", mb: 2, mt: 1 }} />
            </Box>

            <Slider {...settings}>
                {mediaItems.map((item, index) => (
                    <Box key={index} sx={{ p: 1 }}>
                        <Card
                            onClick={() => handleOpenMedia(item)}
                            sx={{
                                height: "500px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                borderRadius: 2,
                                overflow: "hidden",
                                cursor: "pointer",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                "&:hover": {
                                    transform: "scale(1.03)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                },
                                position: "relative",
                            }}
                        >
                            {item.type === "video" ? (
                                <video
                                    ref={(el) => (carouselVideoRefs.current[index] = el!)}
                                    width="100%"
                                    height="100%"
                                    style={{ objectFit: "cover" }}
                                    muted
                                    controls={false} // remove controls in carousel
                                >
                                    <source src={item.src} type="video/mp4" />
                                </video>
                            ) : (
                                <img
                                    src={item.src}
                                    alt={item.title}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            )}

                            {/* Overlay play icon for video */}
                            {item.type === "video" && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        color: "white",
                                        fontSize: 60,
                                        pointerEvents: "none",
                                        opacity: 0.8,
                                    }}
                                >
                                    ▶
                                </Box>
                            )}
                        </Card>
                    </Box>
                ))}
            </Slider>

            {/* Media Dialog */}
            <Dialog open={!!openMedia} onClose={handleCloseMedia} maxWidth="lg">
                <Box sx={{ position: "relative", bgcolor: "black" }}>
                    <IconButton
                        onClick={handleCloseMedia}
                        sx={{ position: "absolute", top: 8, right: 8, zIndex: 10, color: "white" }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {openMedia?.type === "video" ? (
                        <video width="100%" height="100%" controls autoPlay>
                            <source src={openMedia.src} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img
                            src={openMedia?.src}
                            alt="Media"
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                    )}
                </Box>
            </Dialog>
        </Container>
    );
};

export default VideoSection;
