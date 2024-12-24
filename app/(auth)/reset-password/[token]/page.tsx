"use client";
import FormLoadingSpinner from "@/components/loaders/FormLoadingSpinner";
import { useResetPasswordMutation } from "@/redux/api/authApiSlice";
import { ReloadOutlined } from "@ant-design/icons";
import { Form } from "antd";
import FormItem from "antd/es/form/FormItem";
import Password from "antd/es/input/Password";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

type Props = {};

const customizeRequiredMark = (
  label: React.ReactNode,
  { required }: { required: boolean }
) => (
  <>
    {label}
    {required && <span className="text-red-500 ml-[2px]">*</span>}
  </>
);

const page = (props: Props) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const params = useParams();
  const [resetPassword, { isError, isLoading, isSuccess, data, error }] =
    useResetPasswordMutation();

  const handleSubmit = (values: any) => {
    resetPassword({ token: params?.token, password: values.password });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccess) {
      router.replace(`/`);
      toast.success(data.message, { duration: 10000 });
    }

    if (isError) {
      const customError = error as { data: any; status: number };
      toast.error(customError.data.message, { duration: 10000 });
    }
  }, [isSuccess, isError, error, data]);

  return (
    <div className="relative -translate-y-[25%] max-w-[500px] w-[90%] flex flex-col border rounded-lg shadow-shadow-2 bg-login-box p-3">
      <div className="p-3 rounded-lg grid place-items-center bg-white shadow-shadow-1 w-fit mx-auto mb-4">
        <ReloadOutlined className="text-2xl" />
      </div>

      <p className="text-xl font-semibold text-center">Reset Your Password</p>
      <p className="text-sm font-normal text-[#666] text-center">
        Don’t worry! Enter the new password below to reset your account’s
        password. Your security is our priority, and we’ve made it easy to
        regain access.
      </p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4 flex flex-col gap-4"
        requiredMark={customizeRequiredMark}
      >
        <div className="">
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
        </div>
        <button
          type="submit"
          className="bg-black h-[39.6px] text-white py-[7px] px-[11px] rounded-[8px] flex justify-center items-center gap-2"
        >
          {isLoading && <FormLoadingSpinner />}
          <p className="font-medium">Reset Your Password</p>
        </button>
      </Form>
    </div>
  );
};

export default page;
