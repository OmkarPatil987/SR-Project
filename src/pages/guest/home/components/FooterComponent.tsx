import React from 'react';
import { Box, Typography, Container, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { Facebook, X, Instagram, WhatsApp } from "@mui/icons-material";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const socialLinks = [
        {
            name: "Facebook",
            url: "https://www.facebook.com/share/19V4YoFhvU/",
            icon: (
                <Facebook sx={{ fontSize: 27, width: 45, height: 45, borderRadius: "50%", bgcolor: "#1877F2", color: "white", p: 1 }} />
            )
        },
        {
            name: "Twitter",
            url: "https://x.com/CMRF_MH?t=Ldnbet9_aBjTsHm0kpGw_g&s=08",
            icon: (
                <X sx={{ fontSize: 27, width: 45, height: 45, borderRadius: "50%", bgcolor: "black", color: "white", p: 1 }} />
            )
        },
        {
            name: "Instagram",
            url: "https://www.instagram.com/cmrf_maharashtra?igsh=b2tqb3JlZ3B6ZXo=",
            icon: (
                <Instagram sx={{ fontSize: 27, width: 45, height: 45, borderRadius: "50%", background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)", color: "white", p: 1, }} />
            ),
        },
        {
            name: "WhatsApp",
            url: "https://whatsapp.com/channel/0029Vb65auMCHDyoCtIB3W2O",
            icon: (
                <WhatsApp sx={{ fontSize: 27, width: 45, height: 45, borderRadius: "50%", bgcolor: "#25D366", color: "white", p: 1 }} />
            )
        }
    ];

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                py: 1.5,
                zIndex: 3,
                textAlign: 'center',
                width: '100%',
            }}
        >
            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <List sx={{ width: { xs: '12%', sm: '4%' }, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, }}>
                        {socialLinks.map((social, index) => (
                            <ListItem key={index + 'social'} disablePadding>
                                <ListItemButton component="a" href={social.url} target="_blank" rel="noopener noreferrer">
                                    <ListItemIcon>{social.icon}</ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Typography
                    variant="body2"
                    sx={{
                        fontSize: {
                            xs: '0.75rem',  // Smaller on extra-small screens
                            sm: '1rem', // Default body2 size on small+
                        },
                        px: 2,
                        lineHeight: 2.0,
                    }}
                >
                    © {currentYear} Chief Minister's Relief Fund and Charitable Hospital Help Desk / मुख्यमंत्री सहाय्यता निधी व धर्मादाय रुग्णालय मदत कक्ष, Maharashtra


                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;