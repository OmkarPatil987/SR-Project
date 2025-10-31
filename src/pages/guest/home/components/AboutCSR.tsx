import React from "react";
import { Box, Container, Grid, Card, CardContent, Typography, Divider } from "@mui/material";

const AboutCSR: React.FC = () => {
    return (
        <Box
            sx={{
                width: "100%",
                background: "linear-gradient(135deg, #b3e5fc 0%, #ffffff 100%)",
                py: 8,
                minHeight: "100vh",
            }}
            id="main-content"
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="stretch">
                    {/* LEFT - Marathi Flood Relief Content */}
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: 6,
                                p: 4,
                                height: "100%",
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 12px 24px rgba(0,0,0,0.25)",
                                },
                                background: "linear-gradient(to bottom, #ffffff 0%, #e1f5fe 100%)",
                            }}
                        >
                            <CardContent>
                                {/* <Typography variant="h4" fontWeight="bold" color="#ff9800" mb={2}>
                                    मा. मुख्यमंत्री सचिवालय
                                </Typography>

                                <Typography variant="h6" fontWeight="600" color="#013e5e" mb={2}>
                                    मुख्यमंत्री सहाय्यता निधी व धर्मादाय रुग्णालय मदत कक्ष
                                </Typography> */}

                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    color="#d32f2f"
                                    mb={2}
                                    sx={{ lineHeight: 1.5 }}
                                >
                                    ‘नम्र आवाहन’ 
                                    ‘‘एक हात मदतीचा… पूरग्रस्त महाराष्ट्रासाठी’’
                                </Typography>

                                <Divider sx={{ my: 2, borderColor: "#ffb300" }} />

                                <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.8, fontSize: "1.1rem" }}>
                               <b> पूरग्रस्त महाराष्ट्रासाठी आपली मदत हवी आहे :</b> <br/ >
                                राज्यातील अभूतपूर्व पूर परिस्थितीमुळे राज्यभर वरुणराजा कोपलेला असून ठिकठिकाणी अतिवृष्टीमुळे मोठी जीवित आणि वित्तीय हानी सुरू आहे.
                                कालपर्यंत मराठवाडा व पश्चिम महाराष्ट्रात घुमसणारे राक्षसी ढग आता राज्यभर घोंगावत असून विदर्भ, उत्तर महाराष्ट्रासह कोकणात देखील पावसाने नुकसान वाढण्याची शक्यता आहे.
                                राज्यभर सुरू असलेल्या धरणांच्या पाणलोट क्षेत्रातील अतिवृष्टीमुळे अनेक धरणातून पाण्याचा विसर्ग वाढविण्यात आल्याने नदीकाठच्या गावांना पूराचा वेढा पडत आहे. सर्वाधिक नुकसान राज्यातील बळीराजाचे झाले असून ग्रामीण अर्थव्यवस्था आणि जीवनाचा कणा मोडकळीस आला आहे.<br />
                                अशा प्रसंगी, आपण सर्वांनी पूरग्रस्त महाराष्ट्राच्या बाधितांची आसवे पुसण्यासाठी आणि मोडकळीस आलेल्या संसाराला पुन्हा उभारी देण्यासाठी आपला मदतीचा हात पुढे करायचा आहे.
                                आपण कसे मदत करू शकतो:
                                आर्थिक मदत करून पूरग्रस्तांना अन्न व जीवनावश्यक वस्तू पोहोचविणे
                                स्वयंसेवा (Volunteer Service) करून वस्तूंची पॅकिंग, वितरण आणि मदत कार्यात सक्रिय सहभाग घेणे
                                हा संदेश जास्तीत जास्त लोकांपर्यंत पोहोचविणे
                                <br /><b>आपल्या मदतीने हजारो जीवनात आशा निर्माण होईल. आजच दान करा / स्वयंसेवा करा!</b>
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* RIGHT - QR Code Section */}
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: 6,
                                textAlign: "center",
                                p: 4,
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: "translateY(-5px)",
                                    boxShadow: "0 12px 24px rgba(0,0,0,0.25)",
                                },
                                background: "linear-gradient(to bottom, #ffffff 0%, #bbdefb 100%)",
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    color="#ff5722"
                                    mb={2}
                                    sx={{ textShadow: "1px 1px 2px #00000044" }}
                                >
                                    SCAN & PAY
                                </Typography>

                                <img
                                    src="/images/qr.jpeg"
                                    alt="Donate QR"
                                    style={{
                                        width: "70%",
                                        borderRadius: "12px",
                                        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                                        marginBottom: "16px",
                                    }}
                                />

                                <Divider sx={{ mb: 2, borderColor: "#ffb300" }} />

                                <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.8, fontSize: "1rem" }}>
                                    आर्थिक मदतीकरिता बँक अकाउंटची माहिती पुढील प्रमाणे:
                                    <br />
                                    <b>Account Name:</b> Chief Minister's Relief Fund
                                    <br />
                                    <b>Account Number:</b> 10972433751
                                    <br />
                                    <b>IFSC Code:</b> SBIN0000300
                                </Typography>

                                <Box mt={3}>
                                    <Typography
                                        variant="subtitle1"
                                        color="#d32f2f"
                                        fontWeight="bold"
                                        sx={{ fontSize: "1.1rem" }}
                                    >
                                        प्रत्येक मदत महत्त्वाची आहे – आजच मदत करा !
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default AboutCSR;
