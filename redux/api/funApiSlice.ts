import { apiSlice } from "@/redux/api/apiSlice";
import { FunResponse, FunResponseData } from "@/utilities/interfaces";

export const funApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get all fun
    getAllFun: builder.query<FunResponse, undefined>({
      query: () => ({
        url: "/fun",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result?.data.map(({ _id }) => ({
                type: "Fun" as const,
                id: _id,
              })),
              { type: "Fun", id: "LIST" },
            ]
          : [{ type: "Fun", id: "LIST" }],
    }),

    // delete fun
    deleteFun: builder.mutation<
      {
        status: string;
        message: string;
      },
      string
    >({
      query: (funId) => ({
        url: `/fun/${funId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, funId) => [
        { type: "Fun", id: funId },
        { type: "Fun", id: "LIST" },
      ],
    }),

    // edit fun data
    editFun: builder.mutation({
      query: (body) => {
        const formData = body;
        return {
          url: `/fun/${formData.get("id")}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result, error, args) => [
        { type: "Fun", id: args.id },
        { type: "Fun", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetAllFunQuery, useDeleteFunMutation, useEditFunMutation } =
  funApiSlice;
