import React, { useState } from "react";
import NamesInfos from "../Configs/NamesInfos";
//Design
import { LuPackage } from "react-icons/lu";
import { FaGears } from "react-icons/fa6";
import { PiCashRegister } from "react-icons/pi";
import Cashout from "./Cashout/Cashout";
import Stock from "./Stock/Stock";
import Configs from "./Configs/Configs";

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("Withdrawl");
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {/* SideMenu */}
      <div className="w-72 h-full bg-primaryColor gap-5 flex py-4 flex-col items-center shadow-xl">
        <h1 className="text-whiteTextColor text-xl font-bold">
          {NamesInfos.projectName}
        </h1>
        <div className="w-11/12 h-0.5 bg-backgroundColor rounded-full "></div>
        <div className="w-full justify-center items-center h-fit gap-2 flex flex-col">
          {/* Button1 */}
          <div
            onClick={() => {
              setSelectedMenu("Withdrawl");
            }}
            className={`w-11/12 shadow-md cursor-pointer hover:bg-secondaryColor duration-300 transition-colors px-4 flex items-center gap-2 rounded-md h-10 ${
              selectedMenu === "Withdrawl" ? "bg-secondaryColor" : ""
            }`}
          >
            <PiCashRegister className="text-whiteTextColor mt-0.5" size={20} />
            <p className="font-bold text-white text-md">Caixa</p>
          </div>
          {/* Button2 */}
          <div
            onClick={() => {
              setSelectedMenu("Stock");
            }}
            className={`w-11/12 shadow-md cursor-pointer hover:bg-secondaryColor duration-300 transition-colors px-4 flex items-center gap-2 rounded-md h-10 ${
              selectedMenu === "Stock" ? "bg-secondaryColor" : ""
            }`}
          >
            <LuPackage className="text-whiteTextColor mt-0.5" size={20} />
            <p className="font-bold text-white text-md">Resumo</p>
          </div>
          {/* Button3 */}
          <div
            onClick={() => {
              setSelectedMenu("Configs");
            }}
            className={`w-11/12 shadow-md cursor-pointer hover:bg-secondaryColor duration-300 transition-colors px-4 flex items-center gap-2 rounded-md h-10 ${
              selectedMenu === "Configs" ? "bg-secondaryColor" : ""
            }`}
          >
            <FaGears className="text-whiteTextColor mt-0.5" size={20} />
            <p className="font-bold text-white text-md">Ajustes</p>
          </div>
        </div>
      </div>
      {/* Dashboard */}
      <div className="w-full h-full bg-backgroundColor">
        {selectedMenu === "Withdrawl" && <Cashout />}
        {selectedMenu === "Stock" && <Stock />}
        {selectedMenu === "Configs" && <Configs />}
      </div>
    </div>
  );
};

export default Dashboard;
