import React from 'react'
import LandingNav from '../components/LandingNav'
import Landing from '../components/Landing'
import Features from '../components/Features'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <LandingNav />
      <Landing />
      <Features />
      <About />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  )
}

export default Home