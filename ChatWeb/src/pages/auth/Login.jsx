import React from "react";
import Logo from "../../components/Logo";
import { Link, useNavigate } from "react-router";
import LoginIllustration from "../../assets/images/chat-login.svg";
import { EnvelopeSimple, Lock } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../yup/schema/loginSchema";
import { loginAPI } from "../../apis/apis";
import { useDispatch } from "../../redux/store";
import { setUserInfo } from "../../redux/slices/userSlice";
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(loginSchema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data);
    const res = await loginAPI(data);
    if (res) {
      const userInfo = { ...res };
      delete userInfo.accessToken;
      delete userInfo.refreshToken;
      dispatch(setUserInfo(userInfo));
      navigate('/home')
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
              Hey there 🫁, Welcome back. Login to chat with your friends &
              collections
            </p>

            <span className='mt-2 mr-19 inline-block'>
              <img
                src={LoginIllustration}
                alt='login'
                className='h-115 w-auto object-cover'
              />
            </span>
          </div>
        </div>

        <div className='w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2 xl:px-44'>
          <div className='w-full p-4 sm:p-12.5 xl:p-10'>
            <span className='mb-1.5 block font-medium'>start for free</span>
            <h2 className='mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2'>
              Sign In to Messenger
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-4'>
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

              <div className='mb-6'>
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
                <input
                  type='submit'
                  value='Sign In'
                  className='w-full cursor-pointer border border-primary bg-primary p-4 rounded-lg text-white transition hover:bg-opacity-90'
                />
              </div>
              <div className='mt-6 text-center'>
                <p>
                  Don't have any account?{" "}
                  <Link to='/auth/signup' className='text-primary'>
                    Sign up
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
