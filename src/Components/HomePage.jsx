import React, {useState} from 'react'
import Navigation from './Navigation'
import HeroSection from './HeroSection'
import Features from './Features'
import Sidebar from './Sidebar'

const HomePage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
            <Navigation setSidebarOpen={setSidebarOpen}></Navigation>
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}></Sidebar>
            <HeroSection></HeroSection>
            <Features></Features>
        </>
    )
}

export default HomePage
