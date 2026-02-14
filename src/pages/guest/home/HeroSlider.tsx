import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Chip,
    Container,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const HERO_SLIDES = [
    "/images/home/b7.jpg",
    "/images/home/b4.webp",
];

export const HeroSlider = () => {
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <Box component="section" sx={{ bgcolor: "#fff" }}>
            {!isDesktop && (
                <Box sx={{ py: { xs: 6, md: 8 }, background: "linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%)" }}>
                    <Container maxWidth="lg">
                        <Chip
                            label="Government Compliant"
                            sx={{ bgcolor: "#d1fae5", color: "#047857", fontWeight: 700, mb: 2 }}
                        />
                        <Typography variant="h3" sx={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.2 }}>
                            apnaQR - QR Code Platform for{" "}
                            <Box component="span" sx={{ color: "#10b981" }}>
                                Biostimulant Products
                            </Box>
                        </Typography>
                        <Typography sx={{ mt: 2, fontWeight: 600, color: "#334155" }}>
                            Static & Dynamic QR codes for Biostimulants.
                        </Typography>
                        <Typography sx={{ color: "#64748b", fontStyle: "italic", mt: 0.5 }}>
                            (As per FCO 1985 & Ministry of Agriculture Guidelines)
                        </Typography>

                        <Stack spacing={1.5} sx={{ mt: 3 }}>
                            {[
                                "Government compliance",
                                "Product authenticity",
                                "Clear & verified information for farmers",
                            ].map((item) => (
                                <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                                    <CheckCircle sx={{ color: "#10b981" }} />
                                    <Typography sx={{ color: "#475569", fontWeight: 600 }}>{item}</Typography>
                                </Stack>
                            ))}
                        </Stack>

                        <Button
                            onClick={() => navigate("/auth/login")}
                            variant="contained"
                            sx={{
                                mt: 4,
                                bgcolor: "#10b981",
                                "&:hover": { bgcolor: "#059669" },
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: "none",
                                fontWeight: 800,
                                boxShadow: "0 10px 24px rgba(16,185,129,0.35)",
                                width: "100%",
                            }}
                        >
                            Get Started Now
                        </Button>
                    </Container>
                </Box>
            )}

            {isDesktop && (
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: { lg: "80vh" },
                        maxHeight: 750,
                        overflow: "hidden",
                        bgcolor: "#f1f5f9",
                    }}
                >
                    {HERO_SLIDES.map((slide, index) => (
                        <Box
                            key={slide}
                            sx={{
                                position: "absolute",
                                inset: 0,
                                opacity: index === current ? 1 : 0,
                                transition: "opacity 1000ms ease-in-out",
                                zIndex: index === current ? 1 : 0,
                            }}
                        >
                            <Box
                                component="img"
                                src={slide}
                                alt={`Agri Banner ${index + 1}`}
                                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </Box>
                    ))}

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}
                    >
                        {HERO_SLIDES.map((_, index) => (
                            <Box
                                key={index}
                                onClick={() => setCurrent(index)}
                                sx={{
                                    height: 10,
                                    width: index === current ? 40 : 10,
                                    borderRadius: 999,
                                    bgcolor: index === current ? "#ffffff" : "rgba(255,255,255,0.5)",
                                    cursor: "pointer",
                                    transition: "all 200ms ease",
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            )}
        </Box>
    );
};
