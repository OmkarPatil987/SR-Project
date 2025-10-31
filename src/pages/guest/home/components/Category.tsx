import React from "react";
import { Box, Card, CardContent, Container, Divider, Typography } from "@mui/material";
import Slider from "react-slick";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import RiceBowlIcon from "@mui/icons-material/RiceBowl";
import OilBarrelIcon from "@mui/icons-material/LocalGasStation"; // placeholder for oil
import TentIcon from "@mui/icons-material/BedroomParent"; // placeholder for tent
import BlanketIcon from "@mui/icons-material/Deck"; // placeholder for blanket
import UmbrellaIcon from "@mui/icons-material/Umbrella";
import SchoolIcon from "@mui/icons-material/School";
import CookieIcon from "@mui/icons-material/CatchingPokemon"; // placeholder for biscuits
import FavoriteIcon from "@mui/icons-material/Favorite"; // generic donation/food icon

import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import IcecreamIcon from "@mui/icons-material/Icecream";
import EggIcon from "@mui/icons-material/Egg";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import SetMealIcon from "@mui/icons-material/SetMeal";
import RestaurantIcon from "@mui/icons-material/Restaurant";

// Shelter & clothing
import RoofingIcon from "@mui/icons-material/Roofing";
import HouseSidingIcon from "@mui/icons-material/HouseSiding";
import HotelIcon from "@mui/icons-material/Hotel";
import BedIcon from "@mui/icons-material/Bed";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import BackpackIcon from "@mui/icons-material/Backpack";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { DryCleaning, FitnessCenter, Grain,  Opacity, RamenDining, Restaurant, RestaurantMenu } from "@mui/icons-material";

export const categories = [
    // Food & Essentials
    { name: "पिण्याचे पाणी", icon: <LocalDrinkIcon fontSize="large" /> },
    { name: "तांदूळ", icon: <RiceBowlIcon fontSize="large" /> },
    { name: "गहू पीठ", icon: <Grain fontSize="large" /> },
    { name: "डाळी", icon: <Grain fontSize="large" /> },
    { name: "मीठ", icon: <Grain fontSize="large" /> },
    { name: "साखर", icon: <Grain fontSize="large" /> },
    { name: "बिस्कीट", icon: <CookieIcon fontSize="large" /> },
    { name: "पोहे", icon: <RestaurantMenu fontSize="large" /> },
    { name: "उपमा", icon: <RestaurantMenu fontSize="large" /> },
    { name: "इंस्टंट नूडल्स", icon: <RamenDining fontSize="large" /> },
    { name: "ऊर्जा बार", icon: <FitnessCenter fontSize="large" /> },
    { name: "दूध पावडर", icon: <LocalCafeIcon fontSize="large" /> },
    { name: "सेरेलॅक", icon: <RestaurantMenu fontSize="large" /> },
    { name: "फॉर्म्युला", icon: <RestaurantMenu fontSize="large" /> },
    { name: "स्वयंपाकाचे तेल", icon: <Opacity  fontSize="large" /> },
    { name: "डिस्पोजेबल प्लेट-ग्लास-चमचे", icon: <Restaurant fontSize="large" /> },

    // Shelter
    { name: "ताडपत्री", icon: <RoofingIcon fontSize="large" /> },
    { name: "तंबू", icon: <HouseSidingIcon fontSize="large" /> },
    { name: "चादरी-गाद्या-चटया", icon: <BedIcon fontSize="large" /> },
    { name: "टॉवेल", icon: <DryCleaning fontSize="large" /> },
    { name: "रेनकोट-छत्र्या-गमबूट", icon: <UmbrellaIcon fontSize="large" /> },
    { name: "कपडे", icon: <CheckroomIcon fontSize="large" /> },
    { name: "आतील कपडे", icon: <CheckroomIcon fontSize="large" /> },
    { name: "शाळेची पिशवी", icon: <BackpackIcon fontSize="large" /> },
    { name: "वही", icon: <MenuBookIcon fontSize="large" /> },
    { name: "शाळेचे साहित्य", icon: <SchoolIcon fontSize="large" /> },
];

// export const categories = [
//     // Food & Essentials
//     { name: "Drinking Water", icon: <LocalDrinkIcon fontSize="large" /> }, 
//     { name: "Rice", icon: <RiceBowlIcon fontSize="large" /> }, 
//     { name: "Wheat Flour", icon: <BakeryDiningIcon fontSize="large" /> }, 
//     { name: "Pulses", icon: <Grain fontSize="large" /> }, 
//     { name: "Salt", icon: <DinnerDiningIcon fontSize="large" /> },
//     { name: "Sugar", icon: <Cake fontSize="large" /> }, 
//     { name: "Biscuits", icon: <CookieIcon fontSize="large" /> },
//     { name: "Poha", icon: <RestaurantMenu fontSize="large" /> },
//     { name: "Upma", icon: <RestaurantMenu fontSize="large" /> }, 
//     { name: "Instant Noodles", icon: <RamenDining fontSize="large" /> }, 
//     { name: "Energy Bars", icon: <FitnessCenter fontSize="large" /> }, 
//     { name: "Milk Powder", icon: <LocalCafeIcon fontSize="large" /> }, 
//     { name: "Cerelac", icon: <BakeryDiningIcon fontSize="large" /> }, 
//     { name: "Formula", icon: <BakeryDiningIcon fontSize="large" /> }, 
//     { name: "Cooking Oil", icon: <OilBarrelIcon fontSize="large" /> }, 
//     { name: "Disposable Plates-Glasses-Spoons", icon: <BakeryDiningIcon fontSize="large" /> }, // Better match: TablewareIcon (if available in MUI) or use <RestaurantIcon fontSize="large" /> as a fallback, more specific than BakeryDiningIcon.

//     // Shelter
//     { name: "Tarpaulin", icon: <RoofingIcon fontSize="large" /> }, // Matches well: RoofingIcon suits tarpaulin for shelter.
//     { name: "Tent", icon: <HouseSidingIcon fontSize="large" /> }, // Matches well: HouseSidingIcon represents temporary shelter like tents.
//     { name: "Blankets-Mattresses-Mats", icon: <BedIcon fontSize="large" /> }, // Better match: BedIcon is more specific to bedding than HotelIcon.
//     { name: "Towel", icon: <DryCleaning fontSize="large" /> }, // Better match: DryCleaningIcon relates to towels better than BedIcon.
//     { name: "Raincoat-Umbrella-Gumboots", icon: <UmbrellaIcon fontSize="large" /> }, // Matches well: UmbrellaIcon suits rain protection items.
//     { name: "Clothes", icon: <CheckroomIcon fontSize="large" /> }, // Matches well: CheckroomIcon is perfect for clothes.
//     { name: "Innerwear", icon: <CheckroomIcon fontSize="large" /> }, // Matches well: CheckroomIcon works for innerwear as well.
//     { name: "School Bag", icon: <BackpackIcon fontSize="large" /> }, // Matches well: BackpackIcon is specific to school bags.
//     { name: "Notebook", icon: <MenuBookIcon fontSize="large" /> }, // Matches well: MenuBookIcon suits notebooks.
//     { name: "School Supplies", icon: <SchoolIcon fontSize="large" /> }, // Matches well: SchoolIcon is ideal for school supplies.
// ];

const Categories = () => {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 10,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [
            { breakpoint: 960, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 2 } },
        ],
    };
    const categoryColors = [ '#FFEBEE', '#FCE4EC', '#F3E5F5', '#EDE7F6', '#E8EAF6', '#E3F2FD', '#E0F7FA', '#E0F2F1', '#E8F5E9', '#F1F8E9', '#FFFDE7',
        '#FFF8E1', '#FFF3E0'];
    return (
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: '#013E5E', mb: 1, fontWeight: 'bold' }}>
                    Essential Items for Flood Relief
                </Typography>
                <Divider sx={{ backgroundColor: "#ff5722", height: 4, width: 70 , mb:2}} />

                <Typography variant="h6" sx={{ color: '#013E5E', mb: 1, fontWeight: 'bold' }}>
               आपल्या छोट्याशा मदतीने हजारो पूरग्रस्त कुटुंबांना नवजीवनाचा आधार मिळू शकतो 
               </Typography>
               {/* <br /> */}
                <Typography variant="subtitle1" sx={{ color: '#013E5E', mb: 1}}>
                    आज महाराष्ट्रातील अनेक कुटुंबे पूरामुळे उद्ध्वस्त झाली आहेत. घरदार, संसार आणि आशा-आकांक्षा वाहून गेल्या आहेत. या कठीण प्रसंगी आपण सगळ्यांनी एकत्र येऊन मदतीचा हात पुढे केला, तर त्यांना पुन्हा उभं राहण्याची ताकद मिळेल.
                    </Typography>
                <Typography variant="h6" sx={{ color: '#013E5E', mb: 1, fontWeight: 'bold' }}>

                खालील वस्तू आपण दान करून या पूरग्रस्तांना जीवनावश्यक मदत पोहोचवू शकता.
                </Typography>

                आपल्या प्रत्येक सहकार्यामुळे त्यांच्या डोळ्यांत आशेचा किरण दिसू शकतो.
                चला, एकत्र येऊया आणि महाराष्ट्राला या संकटातून बाहेर काढूया! 
            </Box>
            <Box>
                <Slider {...settings} className="categorySlider">
                    {categories.map((category, index) => {
                        const bgColor = categoryColors[index % categoryColors.length]; // cycle colors
                        return (
                            <Card
                                key={index}
                                sx={{
                                    height: 110,
                                    display: 'flex !important',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '10px',
                                    position: 'relative',
                                    background: bgColor,
                                    border: '1px solid #ddd',
                                    boxShadow: 'none',
                                    mx: 1,
                                }}
                            >
                                <CardContent
                                    sx={{
                                        textAlign: 'center',
                                        p: 2,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Box sx={{ color: '#1976d2', mb: 1, fontSize: 32 }}>
                                        {category.icon}
                                    </Box>
                                    <Typography variant="body2" sx={{ color: '#013E5E', fontWeight: 'bold' }}>
                                        {category.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Slider>
            </Box>
        </Container>
    );
};

export default Categories;
