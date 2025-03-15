import React from "react";
import Logo from "../../components/Logo";
import { Link, useNavigate } from "react-router";
import SignupIllustration from "../../assets/images/chat-signup.svg";
import { EnvelopeSimple, Lock, User } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../yup/schema/registerSchema";
import { createUserAPI } from "../../apis/apis";
export default function Signup() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    console.log(data);
    delete data.confirmPassword;
    const res = await createUserAPI(data);
    if (res) {
      navigate('/auth/Login')
    } else {
      console.log("Error creating user");
    }
  };

  return (
    <div className='border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-screen'>
      <div className='flex flex-wrap items-center h-full'>
        <div className='hidden w-full xl:block xl:w-1/2'>
          <div className='py-12.5 px-26 text-center'>
            <Link to='/#' className='mb-5.5 inline-block'>
              <Logo />
            </Link>

            <p className='2xl:px-20'>
              Join Messenger & experience the modern way to connect with people
            </p>

            <span className='mt-15 inline-block'>
              <img
                src={SignupIllustration}
                alt='login'
                className='w-64 h-auto object-cover'
              />
            </span>
          </div>
        </div>

        <div className='w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2 xl:px-44'>
          <div className='w-full p-4 sm:p-12.5 xl:p-5'>
            <span className='mb-1 block font-medium'>Start for free</span>
            <h2 className='mb-4 text-2xl font-bold text-black dark:text-white sm:text-title-xl2'>
              Sign Up to Messenger
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-3'>
                <label
                  htmlFor=''
                  className='mb-2.5 block font-medium text-black dark:text-white'
                >
                  Name
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Enter your full name'
                    className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none
                    dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
                    name='name'
                    {...register("name")}
                  />

                  <span className='absolute right-4 top-4'>
                    <User size={24} />
                  </span>
                  {errors.name && (
                    <p className='text-red !font-semibold'>
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='mb-3'>
                <label
                  htmlFor=''
                  className='mb-2.5 block font-medium text-black dark:text-white'
                >
                  Email
                </label>
                <div className='relative'>
                  <input
                    type='email'
                    placeholder='Enter your email'
                    className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none
                  dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
                    name='email'
                    {...register("email")}
                  />

                  <span className='absolute right-4 top-4'>
                    <EnvelopeSimple size={24} />
                  </span>
                  {errors.email && (
                    <p className='text-red !font-semibold'>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='mb-3'>
                <label
                  htmlFor=''
                  className='mb-2.5 block font-medium text-black dark:text-white'
                >
                  Password
                </label>
                <div className='relative'>
                  <input
                    type='password'
                    placeholder='Enter your password'
                    className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none
                  dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
                    name='password'
                    {...register("password")}
                  />

                  <span className='absolute right-4 top-4'>
                    <Lock size={24} />
                  </span>
                  {errors.password && (
                    <p className='text-red !font-semibold'>
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='mb-5'>
                <label
                  htmlFor=''
                  className='mb-2.5 block font-medium text-black dark:text-white'
                >
                  Re-Type Password
                </label>
                <div className='relative'>
                  <input
                    type='password'
                    placeholder='Retype your password'
                    className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none
                  dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
                    name='confirmPassword'
                    {...register("confirmPassword")}
                  />

                  <span className='absolute right-4 top-4'>
                    <Lock size={24} />
                  </span>
                  {errors.confirmPassword && (
                    <p className='text-red !font-semibold'>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='mb-4'>
                <input
                  type='submit'
                  value='Create account'
                  className='w-full cursor-pointer border border-primary bg-primary p-4 rounded-lg text-white transition hover:bg-opacity-90'
                />
              </div>

              <div className='mt-4 text-center'>
                <p>
                  Already have an account?{" "}
                  <Link to='/auth/login' className='text-primary'>
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
