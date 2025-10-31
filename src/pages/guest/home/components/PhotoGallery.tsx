import { Box, Button, Container, Dialog, DialogContent, Divider, Grid, IconButton, Paper, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useState } from "react";
import { Close } from "@mui/icons-material";

const PhotoGallery = () => {
    const [openImage, setOpenImage] = useState(false);
    const [imageSrc, setImageSrc] = useState("");

    const handleImageClick = (src: string) => {
        setImageSrc(src);
        setOpenImage(true);
    };
    const images = [
        "/images/1.jpeg",
        "/images/3.jpeg",
        "/images/4.jpeg",
        "/images/5.jpg",
        "/images/6.jpeg",
        // "/images/image-2.jpeg",
        // "/images/image-3.jpeg",
        // "/images/image-4.jpeg",
        // "/images/image-5.jpeg",
        // "/images/image-6.jpeg",
        "/images/image-7.jpg",
        "/images/image-8.jpg",
        "/images/image-9.jpg",
    ];
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            {
                breakpoint: 960,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 1 },
            },
        ],
    };
    return (
        <Container maxWidth="xl">
            <Box sx={{ width: "100%", p: { xs: 2, md: 4 } }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box sx={{ p: { xs: 2, md: 2 }, textAlign: { xs: "center", md: "left" } }}>
                            <Typography variant="h2" fontWeight="bold" >
                                Photo Gallery
                            </Typography>
                            <Divider sx={{ backgroundColor: "#ff5722", height: 4, width: "70px", borderRadius: 2, mt: 1, mx: { xs: "auto", md: 0 } }} />
                            <Typography variant="h6" mt={2}>
                                📌 Emergency Rescue Operations:
                                Rapid response teams rescuing stranded families in flood-affected areas. Immediate medical assistance and evacuation of vulnerable populations.
                            </Typography>

                            <Typography variant="h6" mt={2}>
                                📌 Food & Water Distribution:
                                Distribution of clean drinking water and food packets to affected residents. Hygiene kits provided to maintain health and sanitation.
                            </Typography>

                            <Typography variant="h6" mt={2}>
                                📌 Temporary Shelters:
                                Setting up safe shelters for displaced families. Health and sanitation services provided along with secure accommodations.
                            </Typography>

                            <Typography variant="h6" mt={2}>
                                📌 Medical Aid & Health Camps:
                                Medical camps organized for treatment of waterborne diseases and injuries. Child vaccinations and awareness programs conducted.
                            </Typography>
                            {/* <Button variant="contained" sx={{ mt: 4 }} endIcon={<RemoveRedEyeOutlined />}>View All</Button> */}
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2} justifyContent="center">
                            <Box sx={{ mt: 4, pb: 3, width: { xs: "100%", sm: "100%" }, mb: 3 }} className="gallerySlider">
                                <Slider {...settings}>
                                    {images.map((src, index) => (
                                        <Box key={index + ''} sx={{ display: "flex", justifyContent: "center", px: 1 }} onClick={() => handleImageClick(src)}>
                                            <img
                                                src={src}
                                                alt={`Slide ${index + 1}`}
                                                style={{
                                                    width: "100%",
                                                    height: "250px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px"
                                                }}
                                               
                                            />

                                        </Box>
                                    ))}
                                </Slider>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            <Dialog
                open={openImage}
                onClose={() => setOpenImage(false)}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        backgroundColor: "rgba(0,0,0,0.85)",
                        boxShadow: "none",
                        m: 0,
                        borderRadius: 2,
                        overflow: "hidden",
                        position: "relative",
                    },
                }}
                BackdropProps={{
                    sx: { backgroundColor: "rgba(0,0,0,0.7)" },
                }}
            >
                <IconButton
                    onClick={() => setOpenImage(false)}
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        color: "white",
                        zIndex: 10,
                        bgcolor: "rgba(0,0,0,0.5)",
                        p: 1.5, // more padding for bigger click area
                        "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                    }}
                >
                    <Close sx={{ fontSize: 32 }} /> {/* Bigger close icon */}
                </IconButton>
                <DialogContent
                    sx={{
                        p: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: { xs: "60vh", md: "80vh" },
                    }}
                >
                    <Box
                        component="img"
                        src={imageSrc}
                        alt="View"
                        sx={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            borderRadius: 1,
                            transition: "transform 0.3s ease",
                            "&:hover": { transform: "scale(1.02)" },
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default PhotoGallery;
