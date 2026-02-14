import React from 'react'
import { Box } from '@mui/material'
import ComplianceSection from './ComplianceSection'
import StaticQr from './StaticQr'
import DynamicQr from './DynamicQr'
import HowItWorks from './HowItWorks'
import Benefits from './Benefits'
import AboutSection from './AboutSection'
import Footer from './Footer'
import { HeroSlider } from './HeroSlider'
import QRComparison from './QRComparision'
import PricingSection from './PricingSection'

const HomePage = () => {
  return (
    <Box component="main" sx={{ bgcolor: 'background.default' }}>
      <HeroSlider />
      <ComplianceSection />
      <StaticQr />
      <DynamicQr />
      <QRComparison />
      <HowItWorks />
      <Benefits />
      <AboutSection />
          <PricingSection />

      <Footer />
    </Box>
  )
}

export default HomePage
