import { useRef, useState } from "react";
import Slider from "react-slick";
import { Box, Card, Container, IconButton } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PlayArrow, Pause, ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
const images = [
    "images/partner/aapke-sarakar.png",
    "images/partner/charity-maharashtra-logo.png",
    "images/partner/cm-relief-fund-logo.png",
    "images/partner/india-gov-in.png",
    "images/partner/maharatra-sasan.png",
    "images/partner/mjpjay-logo.png",
    "images/partner/my-gov.png",
    "images/partner/pmnrf-logo.png",
    "images/partner/RBSK-logo.png",
];
const PartnerSlider = () => {
    const sliderRef = useRef<Slider | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        Padding: 1,
        responsive: [
            {
                breakpoint: 960,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 2 },
            },
        ],
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
    };
    const togglePlayPause = () => {
        if (isPlaying) {
            sliderRef.current?.slickPause();
        } else {
            sliderRef.current?.slickPlay();
        }
        setIsPlaying(!isPlaying);
    };
    return (
        <Container sx={{ pb: 4.5 }} maxWidth="xl">
            <Card elevation={0} sx={{ overflow: "visible", p: 2, my: 2 }}>
                <Box sx={{ width: "100%", overflow: "visible", position: "relative" }}>
                    <IconButton
                        onClick={togglePlayPause}
                        sx={{ position: "absolute", top: "auto", left: { xs: '44%', sm: '48%' }, bottom: '-60px', zIndex: 10 }}
                    >
                        {isPlaying ? <Pause /> : <PlayArrow />}
                    </IconButton>
                    <Slider ref={sliderRef} {...settings} className="partnerSlider">
                        {images.map((src, index) => (
                            <Box key={index + '1'} sx={{ px: 1, height:'70px', display:'flex !important', alignItems:'center' }}>
                                <img
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    style={{ height: "auto", width: "50%" }}
                                />
                            </Box>
                        ))}
                    </Slider>
                </Box>
            </Card>
        </Container>
    )
}
const CustomPrevArrow = (props: any) => {
    const { onClick } = props;
    return (
        <IconButton
            onClick={onClick}
            sx={{ position: "absolute", top: "auto", left: { xs: '35%', sm: '45%' }, bottom: '-80px', zIndex: 10, transform: "translateY(-50%)" }}
        >
            <ArrowBackIos />
        </IconButton>
    );
};

const CustomNextArrow = (props: any) => {
    const { onClick } = props;
    return (
        <IconButton
            onClick={onClick}
            sx={{ position: "absolute", top: "auto", right: { xs: '35%', sm: '45%' }, bottom: '-80px', zIndex: 10, transform: "translateY(-50%)" }}
        >
            <ArrowForwardIos />
        </IconButton>
    );
};
export default PartnerSlider