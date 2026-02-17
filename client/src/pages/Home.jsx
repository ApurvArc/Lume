import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import Description from '../components/Description'
import AiTools from '../components/AiTools'
import Testimonials from '../components/Testimonials'
import GenerateBtn from '../components/GenerateBtn'

const Home = () => {
  return (
    <div>
      <Header />
      <Steps />
      <Description />
      <AiTools />
      <Testimonials />
      <GenerateBtn />
    </div>
  )
}

export default Home