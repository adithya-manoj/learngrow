import React from 'react'

const BioForm: React.FC = () => {
  return (
    <div className='p-6 border border-gray-500 py-12 rounded-lg shadow-md w-full max-w-md'>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form className="flex flex-col gap-4">

            <div className='text-left'>
                <label className="block mb-1 font-medium" htmlFor="name">Username</label>
                <input className="w-full border border-gray-300 rounded-md px-3 py-2" type="text" id="name" name="name" />
            </div>
            <div className='text-left'>
                <label className="block mb-1 font-medium" htmlFor="name">Password</label>
                <input className="w-full border border-gray-300 rounded-md px-3 py-2" type="password" id="name" name="name" />
            </div>
            <div className='pt-1'>
                <button className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600" type="submit">Login</button>
            </div>
        </form>
    </div>
  )
}

export default BioForm