import React from 'react'
import Hero from './Hero'
import ComplianceSection from './ComplianceSection'
import StaticQr from './StaticQr'
import DynamicQr from './DynamicQr'
import HowItWorks from './HowItWorks'
import Benefits from './Benefits'
import AboutSection from './AboutSection'
import Footer from './Footer'

const HomePage = () => {
  return (
    <div>
          <Hero />
          <ComplianceSection />
          <StaticQr />
          <DynamicQr />
          <HowItWorks />
          <Benefits />
          <AboutSection />
          <Footer/>
    </div>
  )
}

export default HomePage
