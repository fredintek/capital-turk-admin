"use client";
import FormLoadingSpinner from "@/components/loaders/FormLoadingSpinner";
import PageLoader from "@/components/loaders/PageLoader";
import { useLoginMutation } from "@/redux/api/authApiSlice";
import { RootState } from "@/redux/store";
import { LoginOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import FormItem from "antd/es/form/FormItem";
import Password from "antd/es/input/Password";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function Home() {
  const [form] = Form.useForm();
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [login, { isError, isLoading, isSuccess, data, error }] =
    useLoginMutation();

  const customizeRequiredMark = (
    label: React.ReactNode,
    { required }: { required: boolean }
  ) => (
    <>
      {label}
      {required && <span className="text-red-500 ml-[2px]">*</span>}
    </>
  );

  const handleSubmit = (values: any) => {
    console.log("Received values of form: ", values);
    login({ email: values.email, password: values.password });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccess) {
      router.replace(`/dashboard`);
      toast.success(data.message);
    }

    if (isError) {
      const customError = error as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [isSuccess, isError, error, data]);

  // block access to login page if logged in
  useEffect(() => {
    if (authState.token) {
      // don't show login page
      router.replace("/dashboard");
    } else {
      // show login page
      setLoading(false);
    }
  }, [authState.token, router]);

  if (loading) {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="w-full h-[100vh] bg-login-bg">
      {/* LOGO */}
      <nav className="grid place-items-center">
        <div className="w-[180px] h-[100px]">
          <img
            src="/images/capital-turk-logo.png"
            className="w-full h-full object-contain"
            alt="logo"
          />
        </div>
      </nav>

      {/* LOGIN CONTAINER */}
      <section className="h-[calc(100vh-100px)] grid place-items-center">
        <div className="relative -translate-y-[25%] max-w-[500px] w-[90%] flex flex-col border rounded-lg shadow-shadow-2 bg-login-box p-3">
          <div className="p-3 rounded-lg grid place-items-center bg-white shadow-shadow-1 w-fit mx-auto mb-4">
            <LoginOutlined className="text-2xl" />
          </div>

          <p className="text-xl font-semibold text-center">
            Sign in to Capital Turk CMS
          </p>
          <p className="text-sm font-normal text-[#666] text-center">
            Here, you have the power to manage, customize, and create your data
            effortlessly, all in one centralized space.
          </p>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="mt-4 flex flex-col gap-4"
            requiredMark={customizeRequiredMark}
          >
            {/* FORM FIELDS */}
            <FormItem
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "The input is not a valid email!",
                },
              ]}
            >
              <Input
                className="bg-gray-200"
                placeholder="Email Address"
                size="large"
              />
            </FormItem>

            <FormItem
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
                {
                  pattern:
                    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  message:
                    "Password must contain minimum eight characters, at least one letter, one number and one special character",
                },
              ]}
            >
              <Password
                className="bg-gray-200"
                placeholder="Password"
                size="large"
              />
            </FormItem>
            <button
              type="submit"
              className="bg-black h-[39.6px] text-white py-[7px] px-[11px] rounded-[8px] flex justify-center items-center gap-2"
            >
              {isLoading && <FormLoadingSpinner />}
              <p className="font-medium">Login</p>
            </button>
          </Form>
        </div>
      </section>
    </div>
  );
}
