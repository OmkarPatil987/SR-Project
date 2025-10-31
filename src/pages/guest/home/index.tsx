import { Box, Paper, useTheme } from "@mui/material";
import HomeSlider from "./components/HomeSlider";
import AboutUsComponent from "./AboutUsComponent";
import DistinctProject from "./components/DistinctProject";
import SuccessStory from "./components/SuccessStory";
import PhotoGallery from "./components/PhotoGallery";
import PartnerSlider from "./components/PartnerSlider";
import CsrCategories from "./components/CsrCategories";
import Associates from "./components/Associates";
import LatestUpdates from "./components/LatestUpdates";
import Categories from "./components/Category";
import { DistrictProvider } from "../../../providers/DistrictContext";
import VideoSection from "./components/VideoSection";

const HomePage: React.FC = () => {
    const theme = useTheme();
    return (
        // <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", }} component={Paper} >
        //     <Box width={'100%'}>
        //         <HomeSlider />
        //     </Box>
        //     <AboutUsComponent />
        //     {/* <Box width={'100%'} sx={{ backgroundColor: 'primary.light' }}>
        //         <DistinctProject />
        //     </Box> */}

        //     {/* <Box width={'100vw'}>
        //         <DistrictProvider>
        //             <DistinctProject />
        //         </DistrictProvider>
        //     </Box> */}
        //     <Box width={'100%'}>
        //         <SuccessStory />
        //     </Box>
        //     <Box width={'100%'} sx={{ background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)", py: 6 }}>
        //         <VideoSection />
        //     </Box>

        //     <Box py={5} width={'100%'}>
        //         <Categories />
        //     </Box>
        //     <Box width={'100%'} sx={{ background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)", py: 6 }}>
        //         <Associates />
        //     </Box>
        //     <PhotoGallery />
        //     <Box sx={{ background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)", py: 6, width: "100%", }}>
        //         <CsrCategories />
        //     </Box>
        //     <LatestUpdates />
        // </Box>
        <> {"Home Page Under Construction"}</>
    );
};

export default HomePage;