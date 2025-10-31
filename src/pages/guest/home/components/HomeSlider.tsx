import { Box, Button, Container, Grid, Typography } from "@mui/material"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import useResponsive from "../../../../hooks/useResponsive";
import { openDialog } from "../../../../redux/reducer/dialogSlice";
import { useDispatch } from "react-redux";

const sliderData = [
    {
        image: "/images/slide_latest.jpg",
        noText: true
    },
    {
        title: "समाजसेवा हीच खरी विकासाची दिशा",
        subtitle: "सेवेमध्येच उन्नती, सेवेमध्येच समृद्धी",
        image: "/images/banner-1.png",
    },
    {
        title: "आपल्या हातात आहे जीवन वाचवण्याची ताकद",
        subtitle: "अन्न, आश्रय आणि आरोग्यासाठी मदत करा",
        image: "/images/banner.jpg",
    },
    {
        title: "आपण एकत्रित झालो तर संकट जिंकू शकतो",
        subtitle: "एक छोटी मदत, मोठा बदल",
        image: "/images/banner-1.png",
    },
];

const HomeSlider = () => {
    const dispatch = useDispatch()
    const { isMobile } = useResponsive();
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            { breakpoint: 960, settings: { slidesToShow: 1 } },
            { breakpoint: 600, settings: { slidesToShow: 1 } },
        ],
    };
    const navigate = useNavigate();
    const handleViewDocument = () => {
        dispatch(openDialog({ type: "DistrictContactsSelector", isFullScreen: false, title: 'मदत पाठविण्यासाठी जिल्हा निहाय संपर्क', size: "md" }))
    }
    return (
        <>
            <Box sx={{ position: 'relative' }}>
                {/* Top-right Donate Info Box */}
                {!isMobile && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            backgroundColor: '#fff',
                            color: '#fff',
                            p: 3,
                            borderRadius: '0 0 0 10px',
                            width: { xs: '300px', md: '600px' },
                            zIndex: 10,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        }}
                    >

                        <Typography variant="h6" color="#d32f2f" sx={{ fontWeight: 'bold', mb: 1 }}>
                            आपल्या मदतीची गरज आहे
                        </Typography>
                        <Typography color="#013e5e" variant="body2" sx={{ mb: 2 }}>
                            सध्या महाराष्ट्रातील पूरग्रस्तांना तातडीच्या मदतीची आवश्यकता आहे. आपल्या दानातून त्यांना अन्न, पाणी आणि आश्रय मिळवून दिला जाऊ शकतो.
                        </Typography>
                        <Box display="flex" gap={2} flexWrap="wrap">
                            <Button
                                variant="contained"
                                color="secondary"
                                size="medium"
                                sx={{
                                    borderRadius: 2,
                                    // backgroundColor: "#ff5722",
                                    // "&:hover": { backgroundColor: "#ff5722" },
                                }}
                                onClick={() => navigate("/voluntary/register")}
                            >
                                पूर मदत स्वयंसेवक नोंदणी
                            </Button>
                            <Button
                                variant="outlined"
                                size="medium"
                                color="secondary"
                                sx={{
                                    borderRadius: 1,
                                    // border: '1px solid #ff5722',
                                    // color: '#ff5722',
                                    textTransform: 'none',
                                    // "&:hover": { color: "#ff5722" },

                                }}
                                component="a"
                                href="https://cmrf.maharashtra.gov.in/DonationOnlineForm.action"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ऑनलाईन देणगी
                            </Button>
                            <Button
                                variant="contained"
                                size="medium"
                                color="secondary"
                                sx={{
                                    borderRadius: 2,
                                    // backgroundColor: "#ff5722",
                                    // "&:hover": { backgroundColor: "#ff5722" },
                                }}
                                onClick={() => navigate('/donation-form')}

                            >
                                साहित्य / सामग्री मदतीसाठी संकलन
                            </Button>
                        </Box>
                    </Box>
                )}
                <Slider {...settings} className="homeSlider">
                    {sliderData.map((slide, index) => (
                        <Box key={index} sx={{ flexGrow: 1 }}>
                            {slide.noText ? (
                                <Box
                                    sx={{
                                        height: { xs: 400, md: 500 },
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={slide.image}
                                        alt={`Slide ${index + 1}`}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: { xs: 400, md: 500 },
                                        backgroundImage: `url('/images/banner.jpg')`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'rgb(1 62 94 / 64%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Container maxWidth="xl">
                                            <Grid container spacing={2} alignItems="center">
                                                <Grid item xs={12} md={7}>
                                                    <Typography
                                                        variant="h1"
                                                        sx={{
                                                            fontSize: { xs: '28px', md: '60px' },
                                                            color: '#fff',
                                                            fontWeight: 'bolder',
                                                            textShadow: '0 5px 0 #053046',
                                                        }}
                                                    >
                                                        {slide.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="h4"
                                                        sx={{ color: '#fff', my: 2, mb: 5, fontWeight: 600 }}
                                                    >
                                                        {slide.subtitle}
                                                    </Typography>
                                                    <Box display="flex" gap={1}>
                                                        {/* <Button
                                                        variant="contained"
                                                        size="large"
                                                        sx={{ borderRadius: 1, backgroundColor: '#fdb514' }}
                                                        onClick={() => navigate('/voluntary/register')}
                                                    >
                                                        Volunteer Register / पूर मदत स्वयंसेवक नोंदणी
                                                    </Button> */}
                                                        <Button
                                                            variant="outlined"
                                                            size="large"
                                                            sx={{
                                                                borderRadius: 1,
                                                                backgroundColor: '#fdb514',
                                                                color: '#fff',
                                                            }}
                                                                component="a"
                                                                href="https://cmrf.maharashtra.gov.in/DonationOnlineForm.action"
                                                                target="_blank"
                                                                rel="noopener noreferrer"                                                        >
                                                            Donote Now / मदत करा
                                                        </Button>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} md={5} textAlign="right">
                                                    {/* <Box
                                                component="img"
                                                src={slide.image}
                                                alt={`Slide ${index + 1}`}
                                                sx={{
                                                    width: { xs: '280px', md: '480px' },
                                                    maxWidth: '100%',
                                                    borderRadius: 2,
                                                    height: { xs: 250, md: 300 },
                                                }}
                                            /> */}
                                                </Grid>
                                            </Grid>
                                        </Container>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    ))}
                </Slider>
            </Box>

            <Box py={2}>
                <Container>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={3}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ borderRadius: 1, backgroundColor: '#ff5722', width: '100%' }}
                                onClick={() => navigate('/voluntary/register')}
                            >
                                Volunteer Register / पूर मदत स्वयंसेवक नोंदणी
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderRadius: 1,
                                    border: '1px solid #ff5722',
                                    color: '#ff5722',
                                    width: '100%',
                                }}
                                component="a"
                                href="https://cmrf.maharashtra.gov.in/DonationOnlineForm.action"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Donote Now / ऑनलाईन आर्थिक देणगी
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button
                                variant="contained"
                                size="large"
                                sx={{ borderRadius: 1, backgroundColor: '#ff5722', width: '100%' }}
                                onClick={() => navigate('/donation-form')}
                            >
                                Collection of goods help / वस्तू मदत संकलन
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    borderRadius: 1,
                                    border: '1px solid #ff5722',
                                    color: '#ff5722',
                                    width: '100%',
                                }}
                                onClick={() => handleViewDocument()}
                            >
                                मदत पाठविण्यासाठी जिल्हा निहाय संपर्क
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

        </>

    )
}
export default HomeSlider
