import { useState } from 'react';
import { Box, Typography, IconButton, Grid, Card, CardContent, Paper, Container, Divider, useTheme, Button } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import WaterIcon from '@mui/icons-material/Water';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import HomeIcon from '@mui/icons-material/Home';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PeopleIcon from '@mui/icons-material/People';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useNavigate } from 'react-router-dom';
const categories = [
    { name: 'Rescue Operations', icon: <LocalHospitalIcon /> },
    { name: 'Food & Water Supply', icon: <FoodBankIcon /> },
    { name: 'Temporary Shelters', icon: <HomeIcon /> },
    { name: 'Medical Aid', icon: <HealthAndSafetyIcon /> },
    { name: 'Community Support', icon: <PeopleIcon /> },
    { name: 'Volunteer Programs', icon: <VolunteerActivismIcon /> },
    { name: 'Water & Sanitation', icon: <WaterIcon /> },
];

const CsrCategories = () => {
    const navigate= useNavigate()
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 5,
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

        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: '#013E5E', mb: 1, fontWeight: 'bold' }}>
                    Flood Donor Categories
                </Typography>
                <Divider sx={{ backgroundColor: "#ff5722", height: 4, width: 70,mb:2 }} />
                <Box sx={{ textAlign: "center", py: 1 }}>
                    <Typography variant="h6" sx={{ color: '#013E5E', mb: 1, fontWeight: 'bold' }}>
                        स्वयंसेवक होऊन महाराष्ट्राच्या पूरग्रस्तांसाठी मदत करू शकता.
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={() => navigate("/voluntary/register")}
                        sx={{ borderRadius: 2, px: 4 }}
                    >
                        पूर मदत स्वयंसेवक नोंदणी
                    </Button>
                </Box>
            </Box>
            <Box>
                <Slider {...settings} className="categorySlider">
                    {categories.map((category, index) => (
                        <Card
                            key={index}
                            sx={{
                                height: 140,
                                display: 'flex !important',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '10px',
                                position: 'relative',
                                background: 'white',
                                border: '2px solid transparent',
                            }}
                        >
                            <CardContent sx={{ textAlign: 'center', p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', border: '1px solid #bae9ff', width: '230px', backgroundColor: '#f8f8f8', borderRadius: '5px' }}>
                                <Box sx={{ color: '#1976d2', mb: 1, fontSize: 32 }}>
                                    {typeof category.icon === 'string' ? (
                                        <img src={category.icon} alt={category.name} width="40" height="40" />
                                    ) : (
                                        category.icon
                                    )}
                                </Box>
                                <Typography variant="body2" sx={{ color: '#013E5E', fontWeight: 'bold' }}>
                                    {category.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Slider>
            </Box>
        </Container>

    );
};

export default CsrCategories;
