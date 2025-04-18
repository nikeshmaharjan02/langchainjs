import React from 'react'
import EmailForm from "../components/EmailForm";

const Home = () => {
    return (
        <div className="min-h-screen p-6 bg-gray-100">
          <h1 className="text-2xl font-bold mb-6 text-center">AI Email Generator</h1>
          <EmailForm />
        </div>
    );
}

export default Home