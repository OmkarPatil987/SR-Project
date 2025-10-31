import { Autocomplete, Box, Container, Dialog, DialogContent, DialogTitle, Divider, FormLabel, Grid, IconButton, Tab, Tabs, TextField, Typography, useTheme } from "@mui/material";
import MaharashtraMap from "../../../../components/modules/maharastra-map";
import { District, DistrictProvider, useDistrict } from "../../../../providers/DistrictContext";
import { useCallback, useEffect, useState } from "react";
import { FetchDistrictListService, FetchFloodReliefCountService, FetchRequirementCountSerivce, FetchRequirementsCountService, FetchTalukaListService, FetchVillageListService } from "../../../../utils/services/flood.relied.service";
import { districts as districtsOnMap } from "../../../../components/modules/maharastra-map/districtJson";
import { Close } from "@mui/icons-material";
import { FetchFloodReliefCountRequest, FetchRequirementsCountRequest } from "../../../../utils/dto/request/flood-relief.type";

interface TabContentProps {
    selectedTab: string;
    selectedDistrict: District | null;
    selectedTalukas: any;
    selectedVillages: any;
}

type HelpCategory = 
  | "food" 
  | "shelter" 
  | "health" 
  | "hygiene" 
  | "rescue" 
  | "communication" 
  | "operations" 
  | "others";
interface HelpCategories {
    key: HelpCategory;
    label: string;
}

const categories: Record<string, { count: string, label: string; value: string }[]> = {
    food: [
        { count: '4,000', label: "Drinking Water / पिण्याचे पाणी", value: "drinking_water" },
        { count: '4,000', label: "Rice / तांदूळ", value: "dry_rice" },
        { count: '4,000', label: "Wheat Flour / गहू पीठ", value: "dry_wheat_flour" },
        { count: '4,000', label: "Pulses / डाळी", value: "dry_pulses" },
        { count: '4,000', label: "Salt / मीठ", value: "dry_salt" },
        { count: '4,000', label: "Sugar / साखर", value: "dry_sugar" },
        { count: '4,000', label: "Biscuits / बिस्कीट", value: "rte_biscuits" },
        { count: '4,000', label: "Poha Packets / पोहे", value: "rte_poha" },
        { count: '4,000', label: "Upma Packets / उपमा", value: "rte_upma" },
        { count: '4,000', label: "Instant Noodles / इंस्टंट नूडल्स", value: "rte_instant_noodles" },
        { count: '4,000', label: "Energy Bars / ऊर्जा बार", value: "rte_energy_bars" },
        { count: '4,000', label: "Milk Powder / दूध पावडर", value: "baby_milk_powder" },
    ],
    shelter: [
        { count: '4,000', label: "School Bags / शाळेची पिशवी", value: "school_bags" },
        { count: '4,000', label: "Notebooks / वही", value: "notebooks" },
        { count: '4,000', label: "Tarpaulin Sheets / ताडपत्री", value: "tarpaulin_sheets" },
        { count: '4,000', label: "Temporary Tents / तंबू", value: "temporary_tents" },
        { count: '4,000', label: "Blankets, Bedsheets, Mats / चादरी-गाद्या-चटया", value: "blankets_bedsheets_mats" },
        { count: '4,000', label: "Towels / टॉवेल", value: "towels" },
        { count: '4,000', label: "Raincoats, Umbrellas, Gumboots / रेनकोट-छत्र्या-गमबूट", value: "raincoats_umbrellas_gumboots" },
        { count: '4,000', label: "Clothes (Men, Women, Children) / कपडे", value: "clothes_all" },
        { count: '4,000', label: "Undergarments / आतील कपडे", value: "undergarments" },
    ],
    health: [
        { count: '4,000', label: "ORS Packets / ओआरएस पॅकेट", value: "ors_packets" },
        { count: '4,000', label: "First Aid Kit / प्राथमिक उपचार पेटी", value: "first_aid_kit" },
        { count: '4,000', label: "Cotton, Antiseptic, Bandages / कापूस-अँटीसेप्टिक-बँडेज", value: "cotton_antiseptic_bandages" },
        { count: '4,000', label: "Paracetamol (Fever) / पॅरासिटामॉल", value: "paracetamol" },
        { count: '4,000', label: "Cetirizine (Allergy, Cold) / सेटिरीझिन", value: "cetirizine" },
        { count: '4,000', label: "Ranitidine/Pantoprazole (Acidity) / रॅनिटिडिन/पँटोप्राझोल", value: "acid_reflux_meds" },
        { count: '4,000', label: "Ibuprofen (Pain Relief) / आयबुप्रोफेन", value: "ibuprofen" },
        { count: '4,000', label: "Amoxicillin (Antibiotic) / अॅमॉक्सिसिलिन", value: "amoxicillin" },
        { count: '4,000', label: "ORS + Glucose Packets / ओआरएस + ग्लुकोज", value: "ors_glucose" },
        { count: '4,000', label: "Sanitary Pads / सॅनिटरी पॅड", value: "sanitary_pads" },
        { count: '4,000', label: "Baby & Adult Diapers / डायपर", value: "diapers_baby_adult" },
        { count: '4,000', label: "Mosquito Repellent, Nets / डास प्रतिबंधक, जाळ्या", value: "mosquito_repellent_nets" },
        { count: '4,000', label: "Water Purification Tablets / पाणी शुद्धीकरण गोळ्या", value: "water_purification_tablets" },
    ],
    rescue: [
        { count: '4,000', label: "Life Jackets / लाइफ जॅकेट", value: "life_jackets" },
        { count: '4,000', label: "Ropes / दोरी", value: "ropes" },
        { count: '4,000', label: "Inflatable Boats / हवेचे बोट", value: "inflatable_boats" },
        { count: '4,000', label: "Torch, Emergency Lights, Batteries / टॉर्च-लाईट-बॅटरी", value: "torch_emergency_batteries" },
        { count: '4,000', label: "Whistles / शिट्ट्या", value: "whistles" },
        { count: '4,000', label: "Stretchers / स्ट्रेचर", value: "stretchers" },
    ],
    hygiene: [
        { count: '4,000', label: "Soap, Shampoo, Detergent / साबण-शाम्पू-धुण्याचा पावडर", value: "soap_shampoo_detergent" },
        { count: '4,000', label: "Toothpaste, Toothbrush / टूथपेस्ट-टूथब्रश", value: "toothpaste_toothbrush" },
        { count: '4,000', label: "Buckets, Mugs / बादल्या-मग", value: "buckets_mugs" },
        { count: '4,000', label: "Disinfectants (Phenyl, Bleaching Powder) / फिनाईल-ब्लीचिंग पावडर", value: "disinfectants" },
        { count: '4,000', label: "Portable Toilets / पोर्टेबल शौचालये", value: "portable_toilets" },
    ],
    communication: [
        { count: '4,000', label: "Power Banks, Solar Chargers / पॉवर बँक- सोलर चार्जर", value: "power_banks_solar_chargers" },
        { count: '4,000', label: "Radios / रेडिओ", value: "radios" },
        { count: '4,000', label: "Extension Boards / एक्स्टेंशन बोर्ड", value: "extension_boards" },
    ],
    operations: [
        { count: '4,000', label: "Fuel (Diesel, Petrol) / इंधन", value: "fuel" },
        { count: '4,000', label: "Transport Vehicles (Trucks, Jeeps, Boats) / वाहने", value: "transport_vehicles" },
        { count: '4,000', label: "PPE Kits for Volunteers / स्वयंसेवक PPE", value: "ppe_kits" },
        { count: '4,000', label: "ID Badges / ओळखपत्रे", value: "id_badges" },
        { count: '4,000', label: "Stationery (Registers, Pens, Markers) / स्टेशनरी", value: "stationery" },
    ],
    others: [
        { count: '4,000', label: "Other Needs / इतर गरजा", value: "other_needs" },
    ],
};

const TabContent: React.FC<TabContentProps> = ({ selectedTab, selectedDistrict, selectedTalukas, selectedVillages }) => {
    const [openPopup, setOpenPopup] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [situationData, setSituationData] = useState({
        affectedHouses: '0',
        affectedPopulation: '0',
        housesDamaged: '0',
        deadAnimals: '0',
        lostAnimals: '0',
        shiftedPopulation: '0',
        affectedRoads: '0',
    });
    const [helpData, setHelpData] = useState({
        food: '0',
        shelter: '0',
        health: '0',
        hygiene: '0',
        rescue: '0',
        communication: '0',
        operations: '0',
        others: '0',
    });

    const handleCountClick = (category: string) => {
        setSelectedCategory(category);
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setSelectedCategory(null);
    };

    const helpCategories:HelpCategories[]  = [
        { key: "food", label: "Food & Nutrition / अन्न आणि पोषण" },
        { key: "shelter", label: "Shelter & Clothing / निवारा आणि कपडे" },
        { key: "health", label: "Health & Medical / आरोग्य आणि वैद्यकीय" },
        { key: "hygiene", label: "Hygiene & Sanitation / स्वच्छता आणि सॅनिटेशन" },
        { key: "rescue", label: "Rescue & Safety / बचाव आणि सुरक्षा" },
        { key: "communication", label: "Communication & Power / संपर्क आणि वीज" },
        { key: "operations", label: "Volunteer Operations / स्वयंसेवक कार्य" },
        { key: "others", label: "Other Needs / इतर गरजा" },
    ];


    const fetchSituationData = useCallback(async () => {
        if (!selectedDistrict?.id) {
            setSituationData({
                affectedHouses: '0',
                affectedPopulation: '0',
                housesDamaged: '0',
                deadAnimals: '0',
                lostAnimals: '0',
                shiftedPopulation: '0',
                affectedRoads: '0',
            });
            return;
        }
        const payload: FetchFloodReliefCountRequest = {
            district_id: Number(selectedDistrict.id),
            taluka_id: selectedTalukas?.id || null,
            village_id: selectedVillages?.id || null,
        };
        const { code, data } = await FetchFloodReliefCountService(payload);
        if (code === 200 && data) {
            setSituationData({
                affectedHouses: data?.affected_houses?.toString() || '0',
                affectedPopulation: data?.affected_population?.toString() || '0',
                housesDamaged: data?.houses_damaged?.toString() || '0',
                deadAnimals: data?.dead_animals?.toString() || '0',
                lostAnimals: data?.lost_animals?.toString() || '0',
                shiftedPopulation: data?.shifted_population?.toString() || '0',
                affectedRoads: data?.affected_roads?.toString() || '0',
            });
        } else {
            setSituationData({
                affectedHouses: '0',
                affectedPopulation: '0',
                housesDamaged: '0',
                deadAnimals: '0',
                lostAnimals: '0',
                shiftedPopulation: '0',
                affectedRoads: '0',
            });
        }
    }, [selectedDistrict?.id, selectedTalukas?.id, selectedVillages?.id]);

    const fetchHelpData = useCallback(async () => {
        if (!selectedDistrict?.id) {
            setHelpData({
                food: '0',
                shelter: '0',
                health: '0',
                hygiene: '0',
                rescue: '0',
                communication: '0',
                operations: '0',
                others: '0',
            });
            return;
        }
        const payload: FetchRequirementsCountRequest = {
            district_id: Number(selectedDistrict.id),
            taluka_id: selectedTalukas?.id || null,
            village_id: selectedVillages?.id || null,
        };
        const { code, data } = await FetchRequirementsCountService(payload);
        if (code === 200 && data) {
            setHelpData({
                food: data?.requirement_food?.toString() || '0',
                shelter: data?.requirement_shelter?.toString() || '0',
                health: data?.requirement_health?.toString() || '0',
                hygiene: data?.requirement_hygiene?.toString() || '0',
                rescue: data?.requirement_rescue?.toString() || '0',
                communication: data?.requirement_communication?.toString() || '0',
                operations: data?.requirement_operation?.toString() || '0',
                others: data?.requirement_others?.toString() || '0',
            });
        } else {
            setHelpData({
                food: '0',
                shelter: '0',
                health: '0',
                hygiene: '0',
                rescue: '0',
                communication: '0',
                operations: '0',
                others: '0',
            });
        }
    }, [selectedDistrict?.id, selectedTalukas?.id, selectedVillages?.id]);

    useEffect(() => {
        if (selectedTab === 'situation') { }
        fetchSituationData();
        fetchHelpData();
    }, [fetchSituationData, fetchHelpData, selectedTab]);

    return (
        <>
            {selectedTab === "situation" ? (
                <Box
                    sx={{
                        border: '1px solid #013e5e',
                        backgroundColor: "#fdfdfd",
                        width: "100%",
                        borderRadius: '5px',
                        p: { xs: 4 },
                        textAlign: "center",
                        boxShadow: 0,
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6} sx={{ textAlign: "center", mt: 3 }}>
                            <Typography variant="h5" fontWeight="bold" color="#013e5e">
                                Affected Houses <br /> प्रभावित घरे
                            </Typography>
                            <Divider sx={{ backgroundColor: "#013e5e", height: 3, width: 30, borderRadius: 2, mt: 1, mx: "auto" }} />
                            <Typography variant="h2" color="#ff5722" sx={{ mt: 1, fontWeight: "bold" }}>
                                {situationData.affectedHouses}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ textAlign: "center", mt: 3 }}>
                            <Typography variant="h5" fontWeight="bold" color="#013e5e">
                                Affected Population <br /> प्रभावित लोकसंख्या
                            </Typography>
                            <Divider sx={{ backgroundColor: "#013e5e", height: 3, width: 30, borderRadius: 2, mt: 1, mx: "auto" }} />
                            <Typography variant="h2" color="#ff5722" sx={{ mt: 1, fontWeight: "bold" }}>
                                {situationData.affectedPopulation}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ textAlign: "center", mt: 3 }}>
                            <Typography variant="h5" fontWeight="bold" color="#013e5e">
                                Houses Damaged <br /> घर पडझड
                            </Typography>
                            <Divider sx={{ backgroundColor: "#013e5e", height: 3, width: 30, borderRadius: 2, mt: 1, mx: "auto" }} />
                            <Typography variant="h2" color="#ff5722" sx={{ mt: 1, fontWeight: "bold" }}>
                                {situationData.housesDamaged}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ textAlign: "center", mt: 3 }}>
                            <Typography variant="h5" fontWeight="bold" color="#013e5e">
                                Dead Animals Found <br /> मयत जनावरे (सापडलेले)
                            </Typography>
                            <Divider sx={{ backgroundColor: "#013e5e", height: 3, width: 30, borderRadius: 2, mt: 1, mx: "auto" }} />
                            <Typography variant="h2" color="#ff5722" sx={{ mt: 1, fontWeight: "bold" }}>
                                {situationData.deadAnimals}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ textAlign: "center", mt: 3 }}>
                            <Typography variant="h5" fontWeight="bold" color="#013e5e">
                                Lost Animals <br /> जनावरे हरवलेले
                            </Typography>
                            <Divider sx={{ backgroundColor: "#013e5e", height: 3, width: 30, borderRadius: 2, mt: 1, mx: "auto" }} />
                            <Typography variant="h2" color="#ff5722" sx={{ mt: 1, fontWeight: "bold" }}>
                                {situationData.lostAnimals}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ textAlign: "center", mt: 3 }}>
                            <Typography variant="h5" fontWeight="bold" color="#013e5e">
                                Shifted Population <br /> स्थलांतरित लोकसंख्या
                            </Typography>
                            <Divider sx={{ backgroundColor: "#013e5e", height: 3, width: 30, borderRadius: 2, mt: 1, mx: "auto" }} />
                            <Typography variant="h2" color="#ff5722" sx={{ mt: 1, fontWeight: "bold" }}>
                                {situationData.shiftedPopulation}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ textAlign: "center", mt: 3 }}>
                            <Typography variant="h5" fontWeight="bold" color="#013e5e">
                                Affected Roads <br /> प्रभावित रस्ते
                            </Typography>
                            <Divider sx={{ backgroundColor: "#013e5e", height: 3, width: 30, borderRadius: 2, mt: 1, mx: "auto" }} />
                            <Typography variant="h2" color="#ff5722" sx={{ mt: 1, fontWeight: "bold" }}>
                                {situationData.affectedRoads}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <Box
                    sx={{
                        border: '1px solid #013e5e',
                        backgroundColor: "#fdfdfd",
                        width: "100%",
                        borderRadius: '5px',
                        p: { xs: 4 },
                        textAlign: "center",
                        boxShadow: 0,
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        {helpCategories.map((category) => (
                            <Grid item xs={12} md={6} sx={{ textAlign: "center", mt: 3 }} key={category.key}>
                                <Typography variant="h5" fontWeight="bold" color="#013e5e">
                                    {category.label}
                                </Typography>
                                <Divider sx={{ backgroundColor: "#013e5e", height: 3, width: 30, borderRadius: 2, mt: 1, mx: "auto" }} />
                                <Typography
                                    variant="h2"
                                    color="#ff5722"
                                    sx={{ mt: 1, fontWeight: "bold", cursor: "pointer" }}
                                    onClick={() => handleCountClick(category.key)}
                                >
                                    {helpData[category.key]}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
            <Dialog
                open={openPopup}
                onClose={handleClosePopup}
                maxWidth="sm"
                fullWidth
                sx={{
                    "& .MuiDialog-paper": {
                        borderRadius: "5px",
                        border: "1px solid #013e5e",
                        backgroundColor: "#fdfdfd",
                    },
                }}
            >
                <DialogTitle sx={{ color: "#013e5e", fontWeight: "bold", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                            sx={{
                                flexGrow: 1,
                                textAlign: "center",
                                color: "#013e5e",
                                fontWeight: "bold",
                            }}
                        >
                            {helpCategories.find((cat) => cat.key === selectedCategory)?.label ||
                                "Category Details"}
                        </Typography>

                        <IconButton onClick={handleClosePopup} sx={{ color: "#ff5722", ml: "auto" }}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {selectedCategory &&
                            categories[selectedCategory]?.map((item) => (
                                <Grid item xs={12} key={item.value} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1 }}>
                                    <Typography variant="body1" color="#013e5e">
                                        {item.label}
                                    </Typography>
                                    <Typography variant="body1" color="#ff5722" fontWeight="bold">
                                        {item.count}
                                    </Typography>
                                </Grid>
                            ))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
};

const DistinctProject = () => {
    const theme = useTheme();
    const { selectedDistrict, setSelectedDistrict } = useDistrict();
    const [selectedTab, setSelectedTab] = useState<string>("situation");
    const [loading, setLoading] = useState<boolean>(true);

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    };

    const [districts, setDistricts] = useState<any[]>([]);
    const [talukas, setTalukas] = useState<any[]>([]);
    const [villages, setVillages] = useState<any[]>([]);

    const [selectedTalukas, setSelectedTalukas] = useState<any>();
    const [selectedVillages, setSelectedVillages] = useState<any>();

    const fetchDistricts = async () => {
        const payload = { limit: 100, offset: 0 };
        const { code, data } = await FetchDistrictListService(payload);

        if (code === 200 && data?.data) {
            setDistricts(data.data);
        } else {
            setDistricts([]);
        }
    };

    const fetchTalukas = async (district_id: number) => {
        if (!district_id) return setTalukas([]);

        const payload = { district_id, limit: 1000, offset: 0 };
        const { code, data } = await FetchTalukaListService(payload);

        if (code === 200 && data?.data) {
            setTalukas(data.data);
        } else {
            setTalukas([]);
        }

        setVillages([]);
    };

    const fetchVillages = async (taluka_id: number) => {
        if (!taluka_id) return setVillages([]);

        const payload = { taluka_id, limit: 1000, offset: 0 };
        const { code, data } = await FetchVillageListService(payload);

        if (code === 200 && data?.data) {
            setVillages(data.data);
        } else {
            setVillages([]);
        }
    };

    const fetchMainCounts = async () => {
        try {
            setLoading(true);
            const params: any = { limit: 100, offset: 0 };

            if (selectedDistrict) params.district_id = selectedDistrict?.id;
            if (selectedTalukas) params.taluka_id = selectedTalukas.id;
            if (selectedVillages) params.village_id = selectedVillages.id;

            const { code, data } = await FetchRequirementCountSerivce(params);

            if (code === 200 && data) {
                console.log(data);

            } else {

            }
        } catch (error) {
            console.error('Error fetching requirement counts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDistricts();
    }, []);

    useEffect(() => {
        fetchTalukas(Number(selectedDistrict?.id));
    }, [selectedDistrict]);

    useEffect(() => {
        fetchVillages(Number(selectedTalukas));
    }, [selectedTalukas]);

    return (
        <Box sx={{ textAlign: "center", p: { xs: 2, md: 5 } }}>

            <Typography variant="h3" fontWeight="bold"> District Wise Projects </Typography>
            <Divider sx={{ backgroundColor: "#ff5722", height: 4, width: 70, mt: 1, mb: 3, mx: "auto", }} />
            {/* <Typography variant="h6" sx={{ mt: 1 }}> CSR initiatives focus on sustainable development across districts, supporting environmental conservation, <br />community welfare, and ethical business practices. </Typography> */}

            <Box sx={{ borderRadius: 4, height: "auto", mx: "auto", mt: 1, }} >
                <Grid container spacing={2} alignItems="center" p={2}>
                    <Grid item xs={12} md={12} sx={{ textAlign: "center" }}>
                        <Box
                            sx={{
                                transition: "all 0.5s ease-in-out",
                                width: selectedDistrict ? "50%" : "100%",
                                display: "inline-block",
                                maxHeight: '80vh',
                                verticalAlign: "top",
                            }}
                        >
                            <MaharashtraMap />
                        </Box>
                        <Box
                            sx={{
                                transition: "all 0.5s ease-in-out",
                                width: selectedDistrict ? "50%" : "0%",
                                display: "inline-block",
                                verticalAlign: "top",
                                opacity: selectedDistrict ? 1 : 0,
                            }}
                        >
                            {/* <Box sx={{ border: '1px solid #013e5e', backgroundColor: "#fdfdfd", width: "100%", borderRadius: '5px', p: { xs: 2 }, textAlign: "center", boxShadow: 0, transition: "box-shadow 0.4s ease-in-out, transform 0.3s ease-in-out", "&:hover": { transform: "scale(1.02)", boxShadow: "0px 8px 20px rgba(255, 215, 0, 0.3)", }, }} > */}
                            {selectedDistrict?.name}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormLabel>District / जिल्हा <span style={{ color: "red" }}>*</span></FormLabel>
                                    <Autocomplete
                                        size="small"
                                        options={districts}
                                        getOptionLabel={(opt) => opt.name}
                                        value={districts.find((d) => d.id == selectedDistrict?.id) || null}
                                        onChange={(_, newVal) => {
                                            // formik.setFieldValue("district_id", newVal?.id || "");
                                            // setSelectedDistrict(districtsOnMap.find((mapD: any) => mapD.id == newVal?.id) || null)
                                            setSelectedTalukas(null);
                                            setSelectedVillages(null);
                                            if (newVal?.id) {
                                                fetchTalukas(newVal.id);
                                            }
                                            fetchMainCounts();
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select District / जिल्हा निवडा"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormLabel>Taluka / तालुका <span style={{ color: "red" }}>*</span></FormLabel>
                                    <Autocomplete
                                        size="small"
                                        options={talukas} // API response array filtered by district
                                        getOptionLabel={(opt) => opt.name}
                                        value={talukas.find((t) => t.id === selectedTalukas?.id) || null}
                                        onChange={(_, newVal) => {
                                            setSelectedTalukas(talukas.find(e => e.id == newVal?.id));
                                            setSelectedVillages(null); // reset Village
                                            if (newVal?.id) {
                                                fetchVillages(newVal.id); // fetch villages for this taluka
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select Taluka / तालुका निवडा"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <FormLabel>Village / गाव <span style={{ color: "red" }}>*</span></FormLabel>
                                    <Autocomplete
                                        size="small"
                                        options={villages}
                                        getOptionLabel={(opt) => opt.name}
                                        value={villages.find(e => e.id == selectedVillages?.id) || null}
                                        onChange={(_, newVal) => setSelectedVillages(villages.find(e => e.id == newVal?.id))}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select Village / गाव निवडा"
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <Tabs
                                value={selectedTab}
                                onChange={handleTabChange}
                                sx={{
                                    mb: 2,
                                    "& .MuiTab-root": {
                                        color: "#013e5e",
                                        fontWeight: "bold",
                                        fontSize: "1.1rem",
                                        textTransform: "none",
                                        "&.Mui-selected": {
                                            color: "#ff5722",
                                            borderBottom: "3px solid #ff5722",
                                        },
                                    },
                                    "& .MuiTabs-indicator": {
                                        backgroundColor: "#ff5722",
                                        height: 3,
                                    },
                                }}
                            >
                                <Tab label="Situation" value="situation" />
                                <Tab label="Help" value="help" />
                            </Tabs>
                            <TabContent selectedTab={selectedTab} selectedDistrict={selectedDistrict} selectedTalukas={selectedTalukas} selectedVillages={selectedVillages} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default DistinctProject;