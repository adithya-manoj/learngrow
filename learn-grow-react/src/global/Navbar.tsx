import React from 'react'

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">LEarn Grow</h1>
      <ul className="flex gap-6">
        <li><a href="#" className="hover:text-gray-800">Home</a></li>
        <li><a href="#" className="hover:text-gray-200">About</a></li>
        <li><a href="#" className="hover:text-gray-200">Contact</a></li>
      </ul>
    </nav>
  )
}

export default Navbar
