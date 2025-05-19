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
                  src="/placeholder.svg?height=400&width=600"
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
                  src="/placeholder.svg?height=300&width=300"
                  alt="Founder 1"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-1">Darshan AB</h3>
                <p className="text-red-600 font-medium mb-2">Co-Founder & AI Specialist</p>
                <p className="text-gray-600 mb-4">
                  Second year AIML student with a passion for applying machine learning to healthcare problems.
                  Specializes in predictive analytics and real-time data processing.
                </p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-gray-400 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm-1.41 7.08c.84-.58 1.87-.92 2.98-.92 1.11 0 2.14.34 2.98.92a4.007 4.007 0 011.76 2.54 3.99 3.99 0 01-.59 3.18 3.99 3.99 0 01-3 1.72 3.99 3.99 0 01-3-1.72 3.99 3.99 0 01-.59-3.18 4.007 4.007 0 011.76-2.54zM18.34 18c-.84.58-1.87.92-2.98.92-1.11 0-2.14-.34-2.98-.92a4.007 4.007 0 01-1.76-2.54 3.99 3.99 0 01.59-3.18 3.99 3.99 0 013-1.72 3.99 3.99 0 013 1.72 3.99 3.99 0 01.59 3.18 4.007 4.007 0 01-1.76 2.54zM5.66 14.5c-.84-.58-1.87-.92-2.98-.92-1.11 0-2.14.34-2.98.92a4.007 4.007 0 01-1.76 2.54 3.99 3.99 0 01.59 3.18 3.99 3.99 0 013 1.72 3.99 3.99 0 013-1.72 3.99 3.99 0 01.59-3.18 4.007 4.007 0 01-1.76-2.54z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src="/placeholder.svg?height=300&width=300"
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
                  <a href="#" className="text-gray-400 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm-1.41 7.08c.84-.58 1.87-.92 2.98-.92 1.11 0 2.14.34 2.98.92a4.007 4.007 0 011.76 2.54 3.99 3.99 0 01-.59 3.18 3.99 3.99 0 01-3 1.72 3.99 3.99 0 01-3-1.72 3.99 3.99 0 01-.59-3.18 4.007 4.007 0 011.76-2.54zM18.34 18c-.84.58-1.87.92-2.98.92-1.11 0-2.14-.34-2.98-.92a4.007 4.007 0 01-1.76-2.54 3.99 3.99 0 01.59-3.18 3.99 3.99 0 013-1.72 3.99 3.99 0 013 1.72 3.99 3.99 0 01.59 3.18 4.007 4.007 0 01-1.76 2.54zM5.66 14.5c-.84-.58-1.87-.92-2.98-.92-1.11 0-2.14.34-2.98.92a4.007 4.007 0 01-1.76 2.54 3.99 3.99 0 01.59 3.18 3.99 3.99 0 013 1.72 3.99 3.99 0 013-1.72 3.99 3.99 0 01.59-3.18 4.007 4.007 0 01-1.76-2.54z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
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
