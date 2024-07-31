import React, { useEffect, useState } from "react";
import axios from "axios";
//Design
import { LuPackage } from "react-icons/lu";
import { TbPigMoney } from "react-icons/tb";
import { LuPackagePlus } from "react-icons/lu";
import { TiDelete } from "react-icons/ti";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { IoSearchSharp } from "react-icons/io5";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import Alert from "../Components/Alert";
import DeleteProduct from "./DeleteProduct";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import DeleteResume from "./DeleteResume";

const Stock = () => {
  //GET Stock
  const [openProductDeleter, setOpenProductDeleter] = useState(false);
  const [openProductAdd, setOpenProductAdd] = useState(false);
  const [openProductEdit, setOpenProductEdit] = useState(false);
  const [productName, setProductName] = useState("");
  const [unityType, setUnityType] = useState("");
  const [quantityInitial, setQuantityInitial] = useState("");
  const [buyInitial, setBuyInitial] = useState("");
  const [sellInitial, setSellInitial] = useState("");
  const [productId, setProductId] = useState("");
  const [arrayProducts, setArrayProducts] = useState([]);
  const [eyeVisible, setVisibleEye] = useState(true);
  const [eyeVisible2, setVisibleEye2] = useState(true);
  const [requestLoad, setRequestLoad] = useState(false);
  const [firstMessageError, setFirstMessageError] =
    useState("Erro na requesição");
  const [secondMessageError, setSecondMessageError] = useState("");
  const formatToBRL = (value) => {
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });

    return formatter.format(value);
  };
  const getStock = () => {
    setRequestLoad(true);
    let config = {
      method: "GET",
      url: "http://localhost/API/stockController.php",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("AuthorizationMTSBearer"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        switch (response.status) {
          case 200:
            setRequestLoad(false);
            setArrayProducts(response.data.data);
            break;
        }
      })
      .catch((error) => {
        switch (error.response && error.response.status) {
          default:
            console.log(error.response);
            setSecondMessageError("Erro ao tentar realizar a requisição.");
            setTimeout(() => {
              setSecondMessageError("");
            }, 5000);
            break;
        }
      });
  };

  const [arrayResume, setArrayResume] = useState([]);
  const [openResumeDeleter, setOpenResumeDeleter] = useState(false);
  const [resumeID, setResumeID] = useState("");
  const [resumeValue, setResumeValue] = useState("");
  const getResume = () => {
    setRequestLoad(true);
    let config = {
      method: "GET",
      url: "http://localhost/API/resumeController.php",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("AuthorizationMTSBearer"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        switch (response.status) {
          case 200:
            setArrayResume(response.data.data);
            break;
        }
      })
      .catch((error) => {
        switch (error.response && error.response.status) {
          default:
            setSecondMessageError("Erro ao tentar realizar a requisição.");
            setTimeout(() => {
              setSecondMessageError("");
            }, 5000);
            break;
        }
      });
  };

  useEffect(() => {
    getStock();
    getResume();
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = arrayProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-11/12 h-5/6 p-5 flex items-center flex-col bg-backgroundColor shadow-2xl rounded-md">
        <div className="rounded-md  w-full flex flex-col gap-2 px-5 justify-center h-fit py-3 shadow-2xl">
          <p className="text-primaryColor font-bold text-sm">
            Histórido de vendas ({arrayResume.length})
          </p>
          <div className="w-full h-9 border-2 rounded-md flex items-center justify-between px-4">
            <div className="text-primaryColor gap-1 flex items-center w-56 font-bold text-opacity-70 text-sm">
              Valor Total{" "}
              {!eyeVisible2 ? (
                <p className="text-green-500">
                  (
                  {formatToBRL(
                    arrayResume.reduce(
                      (sum, resume) => sum + parseFloat(resume.sold_total),
                      0
                    )
                  )}
                  )
                </p>
              ) : (
                <p className="text-green-500">(R$ ****)</p>
              )}
              {eyeVisible2 ? (
                <AiFillEyeInvisible
                  size={18}
                  onClick={() => {
                    setVisibleEye2(!eyeVisible2);
                  }}
                  className="mt-0.5 cursor-pointer"
                />
              ) : (
                <AiFillEye
                  onClick={() => {
                    setVisibleEye2(!eyeVisible2);
                  }}
                  size={18}
                  className="mt-0.5 cursor-pointer"
                />
              )}
            </div>
            <p className="text-primaryColor w-32 font-bold text-opacity-70 text-sm">
              Descrição
            </p>

            <p className="text-primaryColor opacity-0 font-bold text-opacity-70 text-sm">
              .
            </p>
          </div>
        </div>
        <div className="w-[96%] h-96 overflow-y-auto rounded-md mt-5 ">
          {arrayResume.map((resume) => (
            <div
              key={resume.id}
              className="w-full flex items-center justify-between px-3 shadow-md mb-2 rounded-md border-2 border-primaryColor border-opacity-10 h-fit py-1"
            >
              <p className="font-bold w-44 text-xs">
                {formatToBRL(resume.sold_total)}
              </p>
              <p className="font-bold w-full break-all mr-5 text-xs">
                {resume.description}
              </p>

              {/* <div className="flex items-center gap-2">
                <TiDelete
                  onClick={() => {
                    setResumeID(resume.id);
                    setResumeValue(resume.sold_total);
                    setOpenResumeDeleter(true);
                  }}
                  size={24}
                  className="cursor-pointer hover:text-red-500 duration-300 transition-colors"
                />
              </div> */}
            </div>
          ))}
        </div>
        <div className="mt-2 w-full h-0.5 bg-opacity-10 bg-primaryColor"></div>
        <div className="mt-0 rounded-md  w-full flex flex-col justify-center h-fit py-4 shadow-2xl">
          <div className="w-full flex gap-2 h-10 px-5 rounded-md">
            <div
              onClick={() => {
                setOpenProductAdd(true);
              }}
              className="w-56 px-3 flex items-center gap-2 cursor-pointer hover:opacity-50 justify-center h-10 rounded-md bg-primaryColor"
            >
              <LuPackagePlus className="text-whiteTextColor mt-0.5" size={20} />
              <p className="font-bold text-sm text-whiteTextColor">
                Adicionar produto
              </p>
            </div>
            <div className="w-full border-2 flex items-center gap-2 px-3 rounded-md">
              <IoSearchSharp className="mt-0.5" />
              <input
                type="text"
                placeholder="Pesquise o nome do produto"
                maxLength={100}
                className="w-full h-full outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full px-8 mt-4 flex items-center justify-between">
            <p className="w-fit px-2 py-1 border-2 rounded-md font-bold text-xs h-8 flex items-center justify-center">
              Nome do produto (Quantidade) ({arrayProducts.length})
            </p>
            <p className="w-fit px-2 py-1 border-2 rounded-md font-bold text-xs h-8 flex items-center justify-center">
              Valor de venda
            </p>
            <div className="w-fit flex items-center gap-2 px-2 py-1 border-2 rounded-md font-bold text-xs h-8 justify-center">
              Valor de compra
              {eyeVisible ? (
                <AiFillEyeInvisible
                  size={18}
                  onClick={() => {
                    setVisibleEye(!eyeVisible);
                  }}
                  className="mt-0.5 cursor-pointer"
                />
              ) : (
                <AiFillEye
                  onClick={() => {
                    setVisibleEye(!eyeVisible);
                  }}
                  size={18}
                  className="mt-0.5 cursor-pointer"
                />
              )}
            </div>
            <p className="w-fit px-2 py-1 border-2 rounded-md font-bold text-xs h-8 flex items-center justify-center">
              Ações
            </p>
          </div>
        </div>
        <div className="w-full h-full mt-5 px-5 overflow-y-auto">
          {!requestLoad ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="w-full flex items-center justify-between px-3 shadow-md mb-2 rounded-md border-2 border-primaryColor border-opacity-10 h-10"
              >
                <p
                  className={`font-bold w-56 text-xs ${
                    product.quantity < 1 ? "text-red-500" : ""
                  }`}
                >
                  {product.name.length > 50
                    ? `${product.name.substring(0, 50)}...`
                    : product.name}{" "}
                  ({product.quantity}
                  {product.unit_type === "g"
                    ? " G"
                    : product.unit_type === "ml"
                    ? " ML"
                    : product.unit_type === "L"
                    ? " L"
                    : product.unit_type === "kg"
                    ? " KG"
                    : product.unit_type === "mg"
                    ? " MG"
                    : product.unit_type === "unid"
                    ? " Unidades"
                    : product.unit_type}
                  )
                </p>
                <p className="font-bold w-[5rem] text-sm">
                  {formatToBRL(product.sell_price)}
                </p>
                <p className="font-bold w-[5rem] text-sm">
                  {eyeVisible ? "R$ ******" : formatToBRL(product.buy_price)}
                </p>
                <div className="flex items-center gap-2">
                  <BiSolidMessageSquareEdit
                    size={18}
                    onClick={() => {
                      setOpenProductEdit(true);

                      setProductId(product.id);
                      setProductName(product.name);
                      setQuantityInitial(product.quantity);
                      setSellInitial(product.sell_price);
                      setUnityType(product.unit_type);
                      setBuyInitial(product.buy_price);
                    }}
                    className="cursor-pointer hover:text-blue-500 duration-300 transition-colors"
                  />
                  <TiDelete
                    size={24}
                    onClick={() => {
                      setOpenProductDeleter(true);
                      setProductName(product.name);
                      setProductId(product.id);
                    }}
                    className="cursor-pointer hover:text-red-500 duration-300 transition-colors"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex items-center justify-center h-full">
              <div className="ld text-2xl text-black ld-ring ld-spin"></div>
            </div>
          )}
        </div>
      </div>
      <Alert
        FirstMessage={firstMessageError}
        SecondMessage={secondMessageError}
      />
      <AddProduct
        open={openProductAdd}
        getStock={getStock}
        setOpen={setOpenProductAdd}
      />
      <EditProduct
        inititalTypeProduct={unityType}
        inititalAmount={sellInitial}
        inititalAmount2={buyInitial}
        quantityInitial={quantityInitial}
        productName={productName}
        productId={productId}
        open={openProductEdit}
        getStock={getStock}
        setOpen={setOpenProductEdit}
      />
      <DeleteProduct
        open={openProductDeleter}
        getStock={getStock}
        setOpen={setOpenProductDeleter}
        productName={productName}
        productId={productId}
      />
      <DeleteResume
        open={openResumeDeleter}
        getStock={getStock}
        getResume={getResume}
        setOpen={setOpenResumeDeleter}
        resumeID={resumeID}
        resumeValue={resumeValue}
      />
    </div>
  );
};

export default Stock;
