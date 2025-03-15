import React, { useState } from 'react'
import { Link } from 'react-router'
import { ProfileForm, UpdatePasswordForm } from '../section/Profile'
export default function Profile() {
  const [openTab, setOpenTab] = useState(1)

  const activeClasses = 'text-primary border-primary'
  const inactiveClasses = 'border-transparent'
  return (
    <div className='w-full rounded-sm border border-stroke bg-white py-7.5 px-20 shadow-default dark:border-strokedark dark:bg-boxdark'>
      {/* Button for tabs */}
      <div className='mb-6 flex flex-wrap gap-5 border-b border-stroke dark:border-strokedark sm:gap-10'>
        <Link to='#' onClick={() => { setOpenTab(1) }} className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${openTab === 1 ? activeClasses : inactiveClasses}`}>
          Profile
        </Link>

        <Link to='#' onClick={() => { setOpenTab(2) }} className={`border-b-2 py-4 text-sm font-medium hover:text-primary md:text-base ${openTab === 2 ? activeClasses : inactiveClasses}`}>
          Update Password
        </Link>
      </div>
      {/* Content for tabs */}

      <div>
        <div className={`${openTab === 1 ? 'block' : 'hidden'}`}>
          {/* Profile form */}
          <ProfileForm />
        </div>

        <div className={`${openTab === 2 ? 'block' : 'hidden'}`}>
          {/* update password form */}
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  )
}
