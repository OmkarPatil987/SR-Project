import React from "react";
import { Card, CardContent, Typography, Chip, Box, Container, Divider } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import PlaceIcon from "@mui/icons-material/Place";
import BusinessIcon from "@mui/icons-material/Business";
import { Check } from "@mui/icons-material";
const floodReliefData = [
    {
        title: "Emergency Rescue Operations",
        subtitle: "Rescue Missions",
        organization: "Maharashtra Disaster Management",
        location: "Dharashiv",
        description: "Rapid response teams rescued stranded families in flood-affected areas of Dharashiv, ensuring safety and medical attention.",
        points: [
            "Rescued people from flood-affected areas",
            "Provided emergency medical aid",
            "Evacuated vulnerable populations"
        ],
        image:'/images/image-1.jpeg',
        appPoints: [
            "People rescued swiftly",
            "Immediate medical assistance provided",
            "Vulnerable families evacuated safely"
        ],
        districtNeeds: [
            "Immediate rescue operations required",
            "Medical support for affected families",
            "Evacuation and shelter for vulnerable populations"
        ]
    },
    {
        title: "Food & Water Distribution",
        subtitle: "Relief Supplies",
        organization: "Red Cross India",
        location: "Jalna",
        description: "Distributed clean drinking water and food packets to thousands of flood-affected residents across Jalna district.",
        points: [
            "Food packets distributed",
            "Clean drinking water supply restored",
            "Hygiene kits provided"
        ],
        image:'/images/image-2.jpeg',
        appPoints: [
            "Food delivered to affected families",
            "Clean drinking water restored",
            "Hygiene kits provided for families"
        ],
        districtNeeds: [
            "Food and water supply urgently needed",
            "Hygiene and sanitation kits for families",
            "Distribution points for relief materials"
        ]
    },
    {
        title: "Temporary Shelters",
        subtitle: "Flood Camps",
        organization: "Government of Maharashtra",
        location: "Latur",
        description: "Set up temporary shelters with basic facilities for displaced families due to rising water levels in Latur.",
        points: [
            "Families accommodated in shelters",
            "Health and sanitation services available",
            "Safety and security ensured"
        ],
        image:'/images/image-3.jpeg',
        appPoints: [
            "Shelters provided for displaced families",
            "Health & sanitation services available",
            "Safe and secure environment ensured"
        ],
        districtNeeds: [
            "Temporary shelters for displaced families",
            "Basic facilities including health and sanitation",
            "Ensuring safety and security in camps"
        ]
    },
    {
        title: "Medical Aid & Health Camps",
        subtitle: "Healthcare Support",
        organization: "Doctors Without Borders",
        location: "Sambhajinagar",
        description: "Organized medical camps to provide treatment for waterborne diseases and injuries caused by flooding.",
        points: [
            "Patients treated for illnesses",
            "Vaccinations for children administered",
            "Awareness on waterborne diseases"
        ],
        image:'/images/image-4.jpeg',
        appPoints: [
            "Patients treated and cared for",
            "Child vaccinations conducted",
            "Awareness raised on waterborne diseases"
        ],
        districtNeeds: [
            "Medical aid for flood-affected population",
            "Vaccinations for children",
            "Awareness programs on waterborne diseases"
        ]
    }
];

const SuccessStory: React.FC = () => {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 4,
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
        <Box sx={{ bgcolor: "background.paper", width: "100%", p: "4px 0" }}>
            <Container maxWidth="xl" sx={{ p: { xs: 2, md: 4 } }}>
                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h3" fontWeight="bold" >
                        Flood Relief Initiatives
                    </Typography>
                    <Divider sx={{ backgroundColor: "#ff5722", height: 4, width: 50, mt: 1, mb: 4, m: 'auto' }} />
                </Box>
                <Box sx={{ width: 'auto', overflow: "visible", position: "relative" }}>
                    <Slider {...settings} className="userStory">
                        {floodReliefData.map((item, index) => (
                            <Box key={index + 'flood'} sx={{ px: 2, mt: 4 }}>
                                <Card sx={{
                                    height: "100%",
                                    boxShadow: 4,
                                    borderRadius: "7px",
                                    overflow: "hidden",
                                    transition: "0.3s",
                                    textAlign: "center",
                                    bgcolor: '#2a5d78',
                                    minHeight: '500px',
                                    color: '#fff',
                                    "&:hover": { transform: "scale(1.02)" }
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, }}>
                                        <img src={item.image} alt={item.title} style={{ width: "90%", height: "170px", textAlign: 'center', borderRadius:4 }} />
                                    </Box>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                            {item.subtitle}
                                        </Typography>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} my={1}>
                                            <Box display="flex">
                                                <BusinessIcon sx={{ fontSize: 20, color: "#fff", mr: 1 }} />
                                                <Typography variant="subtitle2">{item.organization}</Typography>
                                            </Box>
                                            {/* <Box display="flex">
                    <PlaceIcon sx={{ fontSize: 20, color: "#fff", mr: 1 }} />
                    <Typography variant="subtitle2">{item.location}</Typography>
                  </Box> */}
                                        </Box>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            {item.description}
                                        </Typography>
                                        {item.appPoints.map((impactItem, i) => (
                                            <Chip
                                                size="small"
                                                icon={<Check />}
                                                variant="outlined"
                                                color="warning"
                                                key={i}
                                                label={impactItem}
                                                sx={{ mr: 1, mt: 1 }}
                                            />
                                        ))}
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Slider>
                </Box>
            </Container>
        </Box>
    );
};
export default SuccessStory;