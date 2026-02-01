import React from 'react'
import Hero from './Hero'
import ComplianceSection from './ComplianceSection'
import StaticQr from './StaticQr'
import DynamicQr from './DynamicQr'
import HowItWorks from './HowItWorks'
import Benefits from './Benefits'
import AboutSection from './AboutSection'
import Footer from './Footer'
import QRGenerator from './QRGenerator'
import { HeroSlider } from './HeroSlider'
import QRComparison from './QRComparision'

const HomePage = () => {
  return (
    <div>
          <HeroSlider/>
          {/* <Hero /> */}
          {/* <QRGenerator/> */}
          <ComplianceSection />
          <StaticQr />
          <DynamicQr />
          <QRComparison/>
          <HowItWorks />
          <Benefits />
          <AboutSection />
          <Footer/>
    </div>
  )
}

export default HomePage
