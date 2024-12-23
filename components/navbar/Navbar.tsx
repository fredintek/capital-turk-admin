import { toggleSidebar } from "@/redux/slices/sidebarSlice";
import { MenuOutlined } from "@ant-design/icons";
import React from "react";
import { useDispatch } from "react-redux";

type Props = {};

const Navbar = (props: Props) => {
  const dispatch = useDispatch();

  return (
    <nav className="p-4 flex justify-between items-center bg-[#0d0d1f] w-screen">
      {/* logo */}
      <div className="flex items-end gap-4">
        <MenuOutlined
          onClick={() => dispatch(toggleSidebar(undefined))}
          className="text-xl text-white cursor-pointer mb-1 md:hidden"
        />
        <div className="w-[150px] h-[50px]">
          <img
            src="/images/capital-turk-logo.png"
            className="w-full h-full object-fill"
            alt="logo"
          />
        </div>
      </div>

      {/* profile */}
      <div>
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-gray-400"></div>
      </div>
    </nav>
  );
};

export default Navbar;
