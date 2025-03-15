import React from 'react'
import User01 from "../../assets/images/user/user-01.png"
import { Camera } from '@phosphor-icons/react'

export default function ProfileForm() {
  return (
    <div className='flex flex-col w-full p-4 space-y-6'>
      {/* image picker */}
      <div className='relative z-30 w-full rounded-full p-1 backdrop-blur sm:max-w-36 sm:p-3'>
        <div className='relative drop-shadow-2'>
          <img src={User01} alt='' className='rounded-full object-center object-cover' />

          <label htmlFor='profile' className='absolute cursor-pointer bottom-0 p-2 right-0 flex items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2'>
            <Camera size={20} />
            <input type='file' name='profile' id='profile' className='sr-only' />
          </label>
        </div>
      </div>

      {/* rest of profile form */}
      <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:max-w-150'>
        <form action=''>
          <div className='flex flex-col gap-5.5 p-6.5'>
            {/* name */}
            <div>
              <label className='mb-3 block text-black dark:text-white'>
                Name
              </label>
              <input type='text' placeholder='Enter your name' className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition forcus:border-primary active:border-primay disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:forcus:border-primary' />
            </div>
            {/* Job Title */}
            <div>
              <label className='mb-3 block text-black dark:text-white'>
                Job Title
              </label>
              <input type='text' placeholder='Enter your Job Title' className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition forcus:border-primary active:border-primay disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:forcus:border-primary' />
            </div>
            {/* Bio */}
            <div>
              <label className='mb-3 block text-black dark:text-white'>
                Bio
              </label>
              <input type='text' placeholder='Enter your Bio' className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition forcus:border-primary active:border-primay disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:forcus:border-primary' />
            </div>
            {/* Submit */}
            <button type="submit" className='w-full cursor-pointer rounded-lg border border-primary bg-primary py-3 px-6 text-white transition hover:bg-opacity-90'>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
