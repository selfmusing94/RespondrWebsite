import { ScrollToTop } from "@/components/scroll-to-top"
import { AnimatedSection } from "@/components/animated-section"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <ScrollToTop />

      {/* Hero Section */}
      <section className="w-full py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Respondr</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're on a mission to revolutionize emergency response systems and save lives through technology.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="w-full py-20 bg-white">
        <AnimatedSection>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Respondr was founded by two passionate students from the AIML department who wanted to make a
                  difference in emergency healthcare.
                </p>
                <p className="text-gray-600 mb-4">
                  After witnessing the challenges in emergency response systems during their research, they decided to
                  create a solution that would connect people with emergency services instantly.
                </p>
                <p className="text-gray-600">
                  Today, Respondr is their flagship project that demonstrates how artificial intelligence and machine
                  learning can be applied to solve real-world problems and potentially save countless lives.
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/amb.png?height=400&width=600"
                  alt="Respondr Team"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* The Founders Section */}
      <section className="w-full py-20 bg-gray-50">
        <AnimatedSection>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Meet the Founders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src="/darshan.png?height=300&width=300"
                  alt="Founder 1"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">Darshan AB</h3>
                <p className="text-red-600 font-medium mb-2">Founder & AI Specialist</p>
                <p className="text-gray-600 mb-4">
                  Second year AIML student with a passion for applying machine learning to healthcare problems.
                  Specializes in predictive analytics and real-time data processing.
                </p>
                <div className="flex justify-center space-x-3">
                <a href="https://www.linkedin.com/in/darshan-ab-/" target="_blank" rel="noopener noreferrer">
                        <img src="/linkedin.png" alt="Linkedin" className="w-6 h-6 hover:opacity-80 transition-opacity"/>
                    </a>
                     <a href="https://github.com/DARSHAN-AB" target="_blank" rel="noopener noreferrer" >
                        <img src="/github_logo.png" alt="GitHub" className="w-6 h-6 hover:opacity-80 transition-opacity"/>
                     </a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src="/a.jpeg?height=300&width=300"
                  alt="Founder 2"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">Gaurav Nayak K</h3>
                <p className="text-red-600 font-medium mb-2">Co-Founder & ML Engineer</p>
                <p className="text-gray-600 mb-4">
                  Second year AIML student focused on mobile application development and geospatial data analysis.
                  Passionate about creating intuitive interfaces for complex systems.
                </p>
                <div className="flex justify-center space-x-3">
                   <a href="https://gauravnayakk.netlify.app" target="_blank" rel="noopener noreferrer">
                        <img src="/website.png" alt="Website" className="w-6 h-6 hover:opacity-80 transition-opacity"/>
                    </a>
                    <a href="https://linkedin.com/in/gauravnayakk" target="_blank" rel="noopener noreferrer">
                        <img src="/linkedin.png" alt="Linkedin" className="w-6 h-6 hover:opacity-80 transition-opacity"/>
                    </a>
                     <a href="https://github.com/selfmusing94" target="_blank" rel="noopener noreferrer" >
                        <img src="/github_logo.png" alt="GitHub" className="w-6 h-6 hover:opacity-80 transition-opacity"/>
                     </a>
                 </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Project Details Section */}
      <section className="w-full py-20 bg-white">
        <AnimatedSection>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">About the Project</h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Academic Project Details</h3>
                <p className="text-gray-600 mb-4">
                  Respondr is an academic project developed by two second-year students from the Artificial Intelligence and Machine Learning department. The project aims to demonstrate how AI/ML technologies can be applied
                  to solve real-world problems in emergency healthcare.
                </p>
                <p className="text-gray-600 mb-4">
                  The system uses machine learning algorithms to predict emergency response times, optimize ambulance
                  routing, and provide real-time decision support for emergency responders.
                </p>
                <p className="text-gray-600 mb-4">Key technologies used in this project include:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-600 space-y-2">
                  <li>Real-time location tracking and geospatial analysis</li>
                  <li>Machine learning for incident classification and prioritization</li>
                  <li>Predictive analytics for resource allocation</li>
                  <li>React and Next.js for the frontend interface</li>
                  <li>Mobile-first responsive design for accessibility</li>
                </ul>
                <p className="text-gray-600">
                  This project was developed under the guidance of the AIML department faculty and with input from
                  emergency medical professionals.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-red-600 text-white">
        <AnimatedSection>
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Help us create a world where emergency medical assistance is accessible to everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white hover:bg-gray-100 text-red-600 font-bold py-3 px-8 rounded-lg transition duration-300"
              >
                Contact Us
              </a>
              <a
                href="/"
                className="bg-transparent hover:bg-red-700 text-white border border-white font-bold py-3 px-8 rounded-lg transition duration-300"
              >
                Try the Demo
              </a>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </main>
  )
}
