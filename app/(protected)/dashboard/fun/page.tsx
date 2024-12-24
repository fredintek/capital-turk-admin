"use client";
import FormLoadingSpinner from "@/components/loaders/FormLoadingSpinner";
import {
  useCreateFunMutation,
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
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const page = (props: Props) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [editRecord, setEditRecord] = useState<FunResponseData | null>(null);
  const {
    data: allFunData,
    isLoading: allFunIsLoading,
    refetch: refetchFunData,
  } = useGetAllFunQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const [
    deleteFun,
    {
      error: deletedFunError,
      isError: deletedFunIsError,
      isSuccess: deletedFunIsSuccess,
      isLoading: deletedFunIsLoading,
      data: deletedFunData,
    },
  ] = useDeleteFunMutation();

  const [
    editFun,
    {
      error: editFunError,
      isError: editFunIsError,
      isSuccess: editFunIsSuccess,
      isLoading: editFunIsLoading,
      data: editFunData,
    },
  ] = useEditFunMutation();

  const [
    createFun,
    {
      error: createFunError,
      isError: createFunIsError,
      isSuccess: createFunIsSuccess,
      isLoading: createFunIsLoading,
      data: createFunData,
    },
  ] = useCreateFunMutation();

  const handleDeleteFunData = async (id: string) => {
    await deleteFun(id);
    refetchFunData();
  };

  const handleCreateFunData = async (values: any) => {
    const formData = new FormData();
    formData.append("time", dayjs(values.time).toString());
    formData.append("title", values.title);
    formData.append("content", values.content);

    if (values.image) {
      formData.append("image", values.image[0].originFileObj);
    }

    await createFun(formData);
    setIsModalOpen(false);
    refetchFunData();
  };

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

    await editFun(formData);
    // Handle modal close and data refetching
    setIsModalOpen(false);
    refetchFunData();
  };

  const handleFormSubmit = (values: any) => {
    if (modalType === "create") {
      handleCreateFunData(values);
    } else {
      handleUpdateFunData(values);
    }
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
                setModalType("edit");
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

  useEffect(() => {
    if (deletedFunIsSuccess) {
      toast.success(deletedFunData.message);
    }

    if (deletedFunIsError) {
      const customError = deletedFunError as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [
    deletedFunError,
    deletedFunIsError,
    deletedFunIsLoading,
    deletedFunIsSuccess,
  ]);

  useEffect(() => {
    if (editFunIsSuccess) {
      toast.success(editFunData.message);
    }

    if (editFunIsError) {
      const customError = editFunError as {
        data: any;
        status: number;
      };
      toast.error(customError.data.message);
    }
  }, [editFunError, editFunIsError, editFunIsLoading, editFunIsSuccess]);

  useEffect(() => {
    if (createFunIsSuccess) {
      toast.success(createFunData.message);
    }

    if (createFunIsError) {
      const customError = createFunError as { data: any; status: number };
      toast.error(customError.data.message);
    }
  }, [createFunError, createFunIsError, createFunIsSuccess, createFunData]);

  return (
    <div className="h-full p-3">
      <button
        onClick={() => {
          setIsModalOpen(true);
          setModalType("create");
          form.resetFields();
        }}
        className="flex mb-3 items-center gap-2 hover:bg-blue-800 transition-colors duration-300 py-2 px-3 bg-blue-500 rounded-lg text-white font-medium"
      >
        <PlusCircleOutlined />
        <span>Add Data</span>
      </button>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={allFunIsLoading}
        scroll={{ x: "100%" }}
      />

      <Modal
        title={modalType === "create" ? "Add Data" : "Edit Data"}
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
              {(editFunIsLoading || createFunIsLoading) && (
                <FormLoadingSpinner />
              )}
              <span
                className={`${
                  editFunIsLoading || createFunIsLoading ? "mt-1" : ""
                }`}
              >
                Submit
              </span>
            </button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="mt-4 flex flex-col gap-4"
          initialValues={
            modalType === "edit"
              ? {
                  time: dayjs(editRecord?.time),
                  title: editRecord?.title,
                  content: editRecord?.content,
                }
              : {}
          }
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
              valuePropName="fileList"
              getValueFromEvent={(e) => {
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
