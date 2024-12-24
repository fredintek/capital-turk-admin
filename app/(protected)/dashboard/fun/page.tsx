"use client";
import FormLoadingSpinner from "@/components/loaders/FormLoadingSpinner";
import {
  useDeleteFunMutation,
  useEditFunMutation,
  useGetAllFunQuery,
} from "@/redux/api/funApiSlice";
import { FunResponseData } from "@/utilities/interfaces";
import {
  DeleteFilled,
  EditFilled,
  PlusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  TimePicker,
  Upload,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";

type Props = {};

const page = (props: Props) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<FunResponseData | null>(null);
  const {
    data: allFunData,
    error: allFunError,
    isError: allFunIsError,
    isSuccess: allFunIsSuccess,
    isLoading: allFunIsLoading,
    refetch: refetchFunData,
  } = useGetAllFunQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const [deleteFun] = useDeleteFunMutation();
  const [editFun, { isLoading: editFunLoading }] = useEditFunMutation();

  const handleDeleteFunData = async (id: string) => {
    await deleteFun(id);
    refetchFunData();
  };

  const columns: ColumnsType<FunResponseData> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
      render: (text, record) => {
        return text;
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: "20%",
      render: (text, record) =>
        `${dayjs(text).hour()}`.padStart(2, "0") +
        ":" +
        `${dayjs(text).minute()}`.padStart(2, "0"),
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      width: "20%",
      render: (text, record) => {
        return text;
      },
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "20%",
      render: (text, record) => {
        return record?.image?.url ? (
          <div className="w-14 h-14 rounded-lg bg-red-500">
            <img
              className="w-full h-full object-cover rounded-lg"
              src={record?.image?.url}
              alt=""
            />
          </div>
        ) : (
          <p className="font-medium text-2xl">-</p>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "20%",
      render: (text, record) => {
        return (
          <div className="flex gap-2 items-center">
            <EditFilled
              onClick={() => {
                setIsModalOpen(true);
                setEditRecord(record);
              }}
              className="text-gray-600 text-lg cursor-pointer"
            />

            <Popconfirm
              title="Are you sure you want to delete this item?"
              onConfirm={() => handleDeleteFunData(`${record?._id}`)}
            >
              <DeleteFilled className="text-gray-600 text-lg cursor-pointer" />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const dataSource = allFunData?.data?.map((item, index) => ({
    ...item,
    key: item._id || index,
  }));

  const handleUpdateFunData = async (values: any) => {
    // Create a new FormData object
    const formData = new FormData();

    // Append basic form data
    formData.append("id", editRecord?._id || "");
    formData.append("time", dayjs(values.time).toString());
    formData.append("title", values.title);
    formData.append("content", values.content);

    // Check if an image is included
    if (values.image) {
      formData.append("image", values.image[0].originFileObj);
    }

    // Log formData to verify it's being set correctly
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    await editFun(formData);
    // Handle modal close and data refetching
    setIsModalOpen(false);
    refetchFunData();
  };

  return (
    <div className="border h-full p-3">
      {/* create fun data cta button */}
      <button className="flex mb-3 items-center gap-2 hover:bg-blue-800 transition-colors duration-300 py-2 px-3 bg-blue-500 rounded-lg text-white font-medium">
        <PlusCircleOutlined />
        <span>Create Fun Data</span>
      </button>
      <Table
        className="h-full"
        scroll={{ x: "100%" }}
        columns={columns}
        loading={allFunIsLoading}
        dataSource={dataSource}
      />

      <Modal
        title="Edit Fun Data"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditRecord(null);
        }}
        footer={
          <div className="flex justify-end items-center">
            <button
              key="back"
              onClick={() => {
                setIsModalOpen(false);
                setEditRecord(null);
              }}
              className="py-2 px-3 bg-red-500 rounded-lg text-white font-medium mr-2"
            >
              Cancel
            </button>
            <button
              onClick={() => form.submit()}
              key="submit"
              className="border flex items-center gap-1 justify-center py-2 px-3 bg-blue-500 rounded-lg text-white font-medium"
            >
              {editFunLoading && <FormLoadingSpinner />}
              <span className={`${editFunLoading ? "mt-1" : ""}`}>Submit</span>
            </button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateFunData}
          className="mt-4 flex flex-col gap-4"
          initialValues={{
            time: dayjs(editRecord?.time),
            title: editRecord?.title,
            content: editRecord?.content,
          }}
        >
          <div className="">
            <FormItem label="Time" name="time">
              <TimePicker className="w-full" format="HH:mm" />
            </FormItem>
          </div>

          <div className="">
            <FormItem label="Title" name="title">
              <Input />
            </FormItem>
          </div>

          <div className="">
            <FormItem label="Content" name="content">
              <TextArea />
            </FormItem>
          </div>

          <div className="">
            <FormItem
              label="Image"
              name="image"
              valuePropName="fileList" // Tells Ant Design to bind the value as 'fileList'
              getValueFromEvent={(e) => {
                // Normalize the value from the upload event
                if (Array.isArray(e)) {
                  return e;
                }
                return e?.fileList;
              }}
            >
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                maxCount={1}
                defaultFileList={
                  editRecord?.image?.url
                    ? [
                        {
                          uid: "-1",
                          name: "current_image",
                          status: "done",
                          url: editRecord?.image?.url,
                        },
                      ]
                    : []
                }
              >
                <button
                  type="button"
                  className="flex gap-2 items-center cursor-pointer border rounded-lg py-2 px-2 bg-white text-gray-600"
                >
                  <UploadOutlined className="text-gray-600" />
                  <span className="text-gray-600">Upload</span>
                </button>
              </Upload>
            </FormItem>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default page;
