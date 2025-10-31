import { useState } from "react";
import { Box, Card, CardContent, Container, Dialog, DialogContent, Divider, Grid, IconButton, Typography } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Close } from "@mui/icons-material";

// const latestUpdates = [
//     {
//         title: "जालना जिल्ह्यातील स्थलांतरित लोकांसाठी आरोग्य तपासणी व सेवा",
//         date: "29 Sept 2025",
//         description:
//             "जालना येथील गोदावरी काठावरील 38 गावातील 9869लोकांचे स्थलांतर करण्यात आले आहे त्या सर्व लोकांची काल प्राथमिक आरोग्य केंद्र व उपकेंद्र यांच्या मदतीने वैद्यकीय तपासणी करून उपचार करण्यात येत आहे आणि  स्थलांतरित केलेल्या ठिकाणी रोज आरोग्य शिबीर लावण्यात आलेले आहे. सदर शिबिरासाठी मा जिल्हा आरोग्य अधिकारी, अतिरिक्त जिल्हा आरोग्य अधिकारी, तालुका आरोग्य अधिकारी, वैद्यकीय अधिकारी, समुदाय आरोग्य अधिकारी, आरोग्य सेविका, आरोग्य सेवक, आशा ताई, व सर्व आरोग्य विभागातील कर्मचारी अधिकारी हे 24 तास सेवा देण्यासाठी तत्पर आहेत.. तसेच सर्व आरोग्य अधिकारी कर्मचारी यांची 24 तास ड्युटी लावण्यात आलेली आहे.",
//         image: "/images/2.jpeg",
//     },
//     {
//         title: "बीड जिल्ह्यातील स्थलांतरित लोकांसाठी आरोग्य तपासणी व उपचार",
//         date: "30 Sept 2025",
//         description:
//             "बीड येथील गोदावरी काठावरील 35 गावातील 2400 लोकांचे स्थलांतर करण्यात आले होते त्या सर्व लोकांची काल प्राथमिक आरोग्य केंद्र व उपकेंद्रे यांच्या मदतीने वैद्यकीय तपासणी करून उपचार करण्यात आले",
//         image: "/images/3.jpeg",
//     },
//     {
//         title: "मुख्यमंत्री सहाय्यता निधीसाठी महाराष्ट्र राज्य सहकारी बँकेची १० कोटी देणगी",
//         date: "30 Sept 2025",
//         description:
//             "मुख्यमंत्री देवेंद्र फडणवीस यांना मुंबई येथे राज्यातील अतिवृष्टीग्रस्तांसाठी महाराष्ट्र राज्य सहकारी बँकेच्यावतीने 'मुख्यमंत्री सहाय्यता निधी'साठी ₹10,00,00,000 देणगीचा धनादेश सुपूर्द करण्यात आला. यावेळी मुख्यमंत्री फडणवीस यांनी आभार मानले!",
//         image: "/images/4.jpeg",
//     },
//     {
//         title: "धुळे पोलिसांकडून मुख्यमंत्री सहाय्यता निधीसाठी २ लाखांची देणगी",
//         date: "30 Sept 2025",
//         description:
//             "राज्यातील विविध जिल्ह्यात झालेल्या अतिवृष्टीमुळे शेतकऱ्यांचे झालेले नुकसान लक्षात घेता, धुळे जिल्ह्यातील पोलीस अधिकारी-कर्मचाऱ्यांनी त्यांच्या वेतनातून थोडीथोडी रक्कम एकत्र करून २ लाख रुपयांचा निधी तयार केला. आज मुख्यमंत्री देवेंद्र फडणवीस यांच्या धुळ्याच्या दौऱ्यावर त्यांचे स्वागत करताना, धुळ्याचे पोलीस अधीक्षक श्रीकांत धिवरे यांनी हा निधी एका धनादेशाद्वारे मुख्यमंत्री सहाय्यता निधीसाठी सुपूर्द केला.",
//         image: "/images/6.jpeg",
//     },

//     {
//         title: "मुख्यमंत्री सहाय्यता निधीसाठी महाराष्ट्र प्रदूषण नियंत्रण मंडळाची १ कोटी रुपयांची देणगी",
//         date: "30 Sept 2025",
//         description:
//             "मुख्यमंत्री देवेंद्र फडणवीस यांना मुंबई येथे राज्यातील अतिवृष्टीग्रस्तांसाठी महाराष्ट्र प्रदूषण नियंत्रण मंडळाच्यावतीने 'मुख्यमंत्री सहाय्यता निधी'साठी मंत्री पंकजा मुंडे यांनी ₹1,00,00,000 देणगीचा धनादेश सुपूर्द केला. यावेळी मुख्यमंत्री फडणवीस यांनी त्यांचे आभार मानले!",
//         image: "/images/7.jpeg",
//     },

//     {
//         title: "मुख्यमंत्री सहाय्यता निधीसाठी श्री गजानन महाराज संस्थान, शेगांवची १.११ कोटी रुपयांची देणगी",
//         date: "30 Sept 2025",
//         description:
//             "मुख्यमंत्री देवेंद्र फडणवीस यांना नागपूर येथे राज्यातील पुरामुळे बाधीत झालेल्या पुरपिडीतांसाठी 'श्री गजानन महाराज संस्थान, शेगांव' यांच्यावतीने 'मुख्यमंत्री सहाय्यता निधी'साठी ₹1,11,00,000 देणगीचा धनादेश सुपूर्द करण्यात आला. यावेळी मुख्यमंत्री फडणवीस यांनी त्यांचे आभार मानले!",
//         image: "/images/image-7.jpg",
//     },

//     {
//         title: "मुख्यमंत्री सहाय्यता निधीसाठी सावित्रीबाई फुले शिक्षण प्रसारक मंडळाची ५.११ लाख रुपयांची देणगी",
//         date: "30 Sept 2025",
//         description:
//             "मुख्यमंत्री देवेंद्र फडणवीस यांना मुंबई येथे राज्यातील अतिवृष्टीग्रस्तांसाठी 'सावित्रीबाई फुले शिक्षण प्रसारक मंडळ' यांच्यावतीने 'मुख्यमंत्री सहाय्यता निधी'साठी ₹5,11,000 देणगीचा धनादेश सुपूर्द करण्यात आला. यावेळी मुख्यमंत्री फडणवीस यांनी त्यांचे आभार मानले!",
//         image: "/images/8.jpeg",
//     },

//     {
//         title: "मुख्यमंत्री सहाय्यता निधीसाठी श्री सद्गुरू शंकर महाराज समाधी ट्रस्ट, पुणे यांची १० लाख रुपयांची देणगी",
//         date: "30 Sept 2025",
//         description:
//             "मुख्यमंत्री देवेंद्र फडणवीस यांना मुंबई येथे अतिवृष्टीग्रस्तांना मदत करण्यासाठी 'श्री सद्गुरू संतवर्य योगीराज शंकर महाराज समाधी ट्रस्ट, पुणे' यांच्यावतीने 'मुख्यमंत्री सहाय्यता निधी'साठी ₹10,00,000 देणगीचा धनादेश सुपूर्द करण्यात आला. लाखो शंकर भक्तांच्या वतीने ही सद्गुरू सेवा मानून विश्वस्त मंडळाने ऑक्टोबर महिन्यात होणार्‍या सद्गुरू शंकर महाराज यांच्या प्रकटदिन सोहळ्यातील सांस्कृतिक कार्यक्रमाच्या खर्चात कपात करून सदर रक्कम दिली आहे. या सेवाभावाबद्दल मुख्यमंत्री फडणवीस यांनी त्यांचे आभार मानले!",
//         image: "/images/9.jpeg",
//     },
// ];


const latestUpdates = [
    {
        title: "कृषी उत्पन्न बाजार समिती, पुणे यांचे मुख्यमंत्री सहाय्यता निधीमध्ये योगदान",
        date: "06 Oct 2025",
        description: "मुख्यमंत्री देवेंद्र फडणवीस यांना मुंबई येथे कृषी उत्पन्न बाजार समिती, पुणे'च्या वतीने अतिवृष्टीग्रस्तांसाठी 'मुख्यमंत्री सहाय्यता निधी'मध्ये ₹25,00,000 देणगीचा धनादेश सुपूर्द करण्यात आला. यावेळी मुख्यमंत्री फडणवीस यांनी त्यांचे आभार मानले!",
        image: "/images/11.jpg",
    },
    {
        title: "गवारे अर्थ मुक्तांच्या वतीने मुख्यमंत्री सहाय्यता निधीमध्ये योगदान",
        date: "06 Oct 2025",
        description: "मुख्यमंत्री देवेंद्र फडणवीस यांना मुंबई येथे 'गवारे अर्थ मुक्तांच्या वतीने अतिवृष्टीग्रस्तांसाठी 'मुख्यमंत्री सहाय्यता निधी'मध्ये ₹5,00,000 देणगीचा धनादेश सुपूर्द करण्यात आला. यावेळी मुख्यमंत्री फडणवीस यांनी त्यांचे आभार मानले!",
        image: "/images/12.jpg",
    },
    {
        title: "पुरुषोत्तम गोडगीळ व धनंजय गोडगीळ यांचे मुख्यमंत्री सहाय्यता निधीमध्ये योगदान",
        date: "06 Oct 2025",
        description: "मुख्यमंत्री देवेंद्र फडणवीस यांना मुंबई येथे अतिवृष्टीग्रस्तांसाठी पुरुषोत्तम गोडगीळ यांच्या वतीने ₹5,00,000 व धनंजय गोडगीळ यांच्या वतीने ₹5,00,000 देणगीचा धनादेश 'मुख्यमंत्री सहाय्यता निधी'मध्ये सुपूर्द करण्यात आला. यावेळी मुख्यमंत्री फडणवीस यांनी त्यांचे आभार मानले!",
        image: "/images/13.jpg",
    },
    {
        title: "केंद्रीय गृह व सहकारमंत्री अमित शाह यांचे प्रवरा परिवाराच्या वतीने मुख्यमंत्री सहाय्यता निधीमध्ये योगदान",
        date: "05 Oct 2025",
        description: "केंद्रीय गृह व सहकारमंत्री अमित शाह यांच्या उपस्थितीत मुख्यमंत्री देवेंद्र फडणवीस यांना अहिल्यानगर येथे 'प्रवरा परिवार'च्या वतीने अतिवृष्टीग्रस्तांसाठी 'मुख्यमंत्री सहाय्यता निधी'मध्ये ₹1,00,00,000 देणगीचा धनादेश सुपूर्द करण्यात आला. यावेळी मुख्यमंत्री फडणवीस यांनी त्यांचे आभार मानले!",
        image: "/images/15.jpg",
    },
    {
        title: "नांदेड येथे नर्सिंग संघटनेकडून पूरग्रस्तांसाठी फूड पॅकेट वितरण",
        date: "06 Oct 2025",
        description: "मुख्यमंत्री सहायता निधी कक्ष जिल्हाधिकारी कार्यालय नांदेड, यांच्या आव्हानाला प्रतिसाद देत नर्सिंग संघटना, डॉ. शंकरराव चव्हाण शासकीय वैद्यकीय महाविद्यालय विष्णुपुरी नांदेड यांनी पूरग्रस्त बाधितांसाठी शंभर फूड पॅकेट तयार केले असून बाधितांना ते आज वाटण्यात येणार आहेत.",
        image: "/images/16.jpg",
    },
];

const LatestUpdates = () => {
    // State for selected update (default first one)
    const [selectedUpdate, setSelectedUpdate] = useState(latestUpdates[0]);
    const [openImage, setOpenImage] = useState(false);
    const [imageSrc, setImageSrc] = useState("");

    const handleImageClick = (src: string) => {
        setImageSrc(src);
        setOpenImage(true);
    };

    // Vertical slider settings
    const settings = {
        dots: false,
        infinite: true,
        vertical: true,
        verticalSwiping: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 6, mb: 6 }}>
            {/* Section Title */}
            <Box textAlign="center" mb={4}>
                <Typography variant="h2" fontWeight="bold">
                    ताज्या घडामोडी / Latest Updates
                </Typography>
                <Divider
                    sx={{
                        width: "60px",
                        borderBottomWidth: 4,
                        bgcolor: "#ff5722",
                        mt: 1,
                        mx: "auto",
                        borderRadius: 2,
                    }}
                />
            </Box>

            <Grid container spacing={4}>
                {/* Left side detailed update */}
                <Grid item xs={12} md={8}>
                    <Card
                        sx={{
                            borderRadius: 2,
                            overflow: "hidden",
                            boxShadow: 4,
                            height: "100%",
                        }}
                    >
                        <Box
                            component="img"
                            src={selectedUpdate.image}
                            alt={selectedUpdate.title}
                            sx={{ width: "100%", height: 550, objectFit: "cover",cursor:'pointer' }}
                            onClick={() => handleImageClick(selectedUpdate.image)}
                        />
                        <CardContent>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", mb: 1 }}
                            >
                                📅 {selectedUpdate.date}
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {selectedUpdate.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {selectedUpdate.description}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right side vertical slider */}
                <Grid item xs={12} md={4} className="latest-update">
                    <Slider {...settings} >
                        {latestUpdates.map((update, index) => (
                            <Box key={index} px={1}>
                                <Card
                                    onClick={() => setSelectedUpdate(update)}
                                    sx={{
                                        borderRadius: 2,
                                        overflow: "hidden",
                                        boxShadow: 3,
                                        mb: 2,
                                        cursor: "pointer",
                                        border:
                                            selectedUpdate.title === update.title
                                                ? "2px solid #013E5E"
                                                : "1px solid #ddd",
                                        transition: "0.3s",
                                        "&:hover": {
                                            transform: "scale(1.02)",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                        },
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={update.image}
                                        alt={update.title}
                                        onClick={() => handleImageClick(update.image)}
                                        sx={{ width: "100%", height: 140, objectFit: "cover", cursor:'pointer' }}
                                    />
                                    <CardContent sx={{ p: 2 }}>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ display: "block", mb: 0.5 }}
                                        >
                                            📅 {update.date}
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {update.title}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </Slider>
                </Grid>
            </Grid>
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

export default LatestUpdates;
