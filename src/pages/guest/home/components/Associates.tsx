import { Box, Card, Container, Divider, Grid, Typography } from "@mui/material"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Associates = () => {
    const donors = [
        { name: "Sai Baba Sansthan Shirdi" },
        { name: "Vitthal Mandir Pandharpur" },
        { name: "Lalbag Raja Ganpati Mandal" },
        { name: "Siddhivinayak Mandir Mumbai" },
        { name: "Vitthal Mandir Pandharpur" },
        { name: "Lalbag Raja Ganpati Mandal" },
    ];

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            {
                breakpoint: 960,
                settings: { slidesToShow: 1 },
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <Container maxWidth='xl'>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                <Typography variant="h2" sx={{ fontWeight: '600', color: '#013E5E' }}>Helping Hands</Typography>
                <Divider sx={{ width: "3%", borderBottomWidth: 4, bgcolor: "#ff5722", mb: 2, mt: 1 }} />
                   <Typography variant="h6" sx={{ color: '#013E5E', mb: 1, fontWeight: 'bold' }}> 
                    आपल्या छोट्याशा मदतीने हजारो पूरग्रस्त कुटुंबांना आधार मिळाला आहे.
                   </Typography>
            </Box>
            <Slider {...settings} className="schemeSlider">
                {donors.map((donor, index) => (
                    <Grid item xs={12} md={2} key={index}>
                        <Card
                            sx={{
                                m: 2,
                                height: '130px',
                                backgroundColor: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #aaa',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                p: 3,
                                borderRadius: 1,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease',
                                cursor: 'pointer',
                                "&:hover": {
                                    transform: 'scale(1.03)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                },
                            }} 
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{donor.name}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Slider>
        </Container>
    );
};

export default Associates;
