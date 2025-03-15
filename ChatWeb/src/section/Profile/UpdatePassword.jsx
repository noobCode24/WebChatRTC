import React from 'react'

export default function UpdatePassword() {
  return (
    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark md:max-w-150'>
      <form action=''>
        <div className='flex flex-col gap-5.5 p-6.5'>
          {/* Current Password */}
          <div>
            <label className='mb-3 block text-black dark:text-white'>
              Current password
            </label>
            <input type='text' placeholder='Enter your password' required className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition forcus:border-primary active:border-primay disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:forcus:border-primary' />
          </div>
          {/* Job Title */}
          <div>
            <label className='mb-3 block text-black dark:text-white'>
              New password
            </label>
            <input type='text' placeholder='Choose new password' required className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition forcus:border-primary active:border-primay disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:forcus:border-primary' />
          </div>

          {/* Submit */}
          <button type="submit" className='w-full cursor-pointer rounded-lg border border-primary bg-primary py-3 px-6 text-white transition hover:bg-opacity-90'>
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
