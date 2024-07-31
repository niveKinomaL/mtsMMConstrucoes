import React, { useEffect, useState } from "react";
import NamesInfos from "../../Configs/NamesInfos";
import axios from "axios";
//Design
import { IoMdArrowDropdown } from "react-icons/io";
import { FaCartArrowDown } from "react-icons/fa6";
import { BsFillCartCheckFill } from "react-icons/bs";
import { IoRemoveCircleSharp } from "react-icons/io5";
import { IoSearchSharp } from "react-icons/io5";
import Alert from "../Components/Alert";

const Cashout = () => {
  const [firstMessageError, setFirstMessageError] =
    useState("Erro na requesição");
  const [secondMessageError, setSecondMessageError] = useState("");
  const [arrayCart, setArrayCart] = useState([]);

  const handleAddCart = (
    nameProduct,
    idProduct,
    quantityProduct,
    subtotalProduct,
    unitTypeProduct
  ) => {
    setArrayCart((prevProducts) => [
      ...prevProducts,
      {
        name: nameProduct,
        idProduct: idProduct,
        quantityProduct: quantityProduct,
        subtotalProduct: subtotalProduct,
        unitTypeProduct: unitTypeProduct,
      },
    ]);
  };

  const [quantity, setQuantity] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [discountReal, setDiscountReal] = useState("");

  //---------------------------------------------------------
  const [isMenuOptions, setMenuOptions] = useState(false);
  const [arrayProducts, setArrayProducts] = useState([]);
  const [productSelect, setProductSelected] = useState("");
  const [productSelectID, setProductSelectedID] = useState("");
  const [productSelectUnitType, setProductSelectedUnitType] = useState("");
  const [productSelectQuantity, setProductSelectedQuantity] = useState("");
  const [productSelectPrice, setProductSelectedPrice] = useState("");

  const [amount, setAmount] = useState("0,00");
  const handleAmountChange = (event) => {
    let rawValue = event.target.value.replace(/[^0-9]/g, "");
    if (parseInt(rawValue, 10) > 99999999) {
      rawValue = "99999999";
    }

    while (rawValue.length > 3 && rawValue[0] === "0") {
      rawValue = rawValue.slice(1);
    }

    if (rawValue === "") {
      setAmount("0,00");
      return;
    }

    while (rawValue.length < 3) {
      rawValue = "0" + rawValue;
    }

    const integerPart = rawValue.slice(0, -2);
    const decimalPart = rawValue.slice(-2);
    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      "."
    );
    const formattedValue = formattedIntegerPart + "," + decimalPart;
    setAmount(formattedValue);
  };

  const amountWithoutCommasAndDots = amount.replace(/[.]/g, "");
  const cleanAmount = parseFloat(amountWithoutCommasAndDots.replace(",", "."));

  const getStock = () => {
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
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = arrayProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    getStock();
  }, []);
  const formatToBRL = (value) => {
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });

    return formatter.format(value);
  };
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [created, setCreated] = useState(false);
  const addProductsToSytem = (description) => {
    setLoadingRequest(true);
    const products = arrayCart.map((item) => ({
      id: item.idProduct,
      quantity: item.quantityProduct,
    }));

    let data = {
      sold_total: arrayCart.reduce(
        (sum, product) => sum + product.subtotalProduct,
        0
      ),
      description: description,
      buy_total: 0,
      products: products,
    };
    let config = {
      method: "POST",
      url: "http://localhost/API/resumeController.php",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("AuthorizationMTSBearer"),
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        switch (response.status) {
          case 201:
            setCreated(true);
            setLoadingRequest(false);
            setProductSelected("");
            setProductSelectedID("");
            setArrayCart([]);
            setTimeout(() => {
              getStock();
              setCreated(false);
            }, 2000);
            break;
        }
      })
      .catch((error) => {
        switch (error.response && error.response.status) {
          default:
            console.log(error.response);
            setSecondMessageError("Você não tem estoque suficiente!");
            setTimeout(() => {
              setSecondMessageError("");
            }, 5000);
            setCreated(false);
            setLoadingRequest(false);
            break;
        }
      });
  };
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-11/12 h-5/6 flex flex-col items-center justify-center py-4 px-6 bg-backgroundColor shadow-2xl duration-300 transition-colors rounded-md">
        <div className="w-full flex gap-5 items-center justify-center flex-row py-4 h-full">
          <div className="w-full p-2 relative h-full gap-2 rounded-lg shadow-2xl border-2 flex items-center flex-col py-2">
            <p className="font-bold text-lg opacity-50">
              {NamesInfos.projectName} - Venda
            </p>
            <div className="w-full border-b-2"></div>
            <div
              onClick={() => {
                setMenuOptions(!isMenuOptions);
              }}
              className="w-full rounded-lg relative cursor-pointer hover:bg-opacity-5 hover:bg-primaryColor h-12 flex items-center justify-start px-3 border-primaryColor border-2 border-opacity-10"
            >
              <p className="text-md font-bold ">
                {productSelect ? (
                  <p className="text-primaryColor opacity-100">
                    {productSelect.length > 40
                      ? productSelect.substring(0, 40)
                      : productSelect}
                  </p>
                ) : (
                  <p className="opacity-50">Selecione o produto</p>
                )}
              </p>
              <IoMdArrowDropdown className="mt-1 opacity-50" size={20} />
            </div>
            {isMenuOptions && (
              <div className="w-[97%] rounded-xl h-72 overflow-y-auto top-[6.2rem] border-2 bg-white shadow-xl z-[100] absolute">
                <div className="w-full flex items-center gap-3 h-10 px-2">
                  <IoSearchSharp />
                  <input
                    type="text"
                    maxLength={100}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pesquise pelo nome do produto"
                    className="outline-none  text-sm w-full "
                  />
                </div>
                <div className="w-full border-b-2"></div>
                <div className="w-full flex items-center justify-center mt-2 flex-col">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        setProductSelected(product.name);
                        setProductSelectedID(product.id);
                        setProductSelectedQuantity(product.quantity);
                        setProductSelectedUnitType(product.unit_type);
                        setProductSelectedPrice(product.sell_price);
                        setMenuOptions(false);
                        setQuantity("");
                        setDiscountPercentage("");
                        setDiscountReal("");
                      }}
                      className={`w-full flex items-center cursor-pointer hover:bg-primaryColor hover:text-backgroundColor justify-between px-3 h-10 ${
                        productSelectID === product.id
                          ? "bg-primaryColor pointer-events-none text-white"
                          : ""
                      } ${
                        product.quantity <= 0
                          ? "pointer-events-none text-red-500"
                          : ""
                      }`}
                    >
                      <p className="font-bold w-44 text-xs">
                        {product.name.length > 60
                          ? `${product.name.substring(0, 60)}...`
                          : product.name}{" "}
                        ({product.quantity}
                        {product.unit_type})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center mt-2 w-full gap-2">
              {productSelect && (
                <div className="w-full border-2 rounded-lg px-2 flex items-start justify-center flex-col font-bold text-xs h-fit py-1">
                  <p>
                    Quantidade disponível: {productSelectQuantity}
                    {productSelectUnitType === "g"
                      ? " G"
                      : productSelectUnitType === "ml"
                      ? " ML"
                      : productSelectUnitType === "L"
                      ? " L"
                      : productSelectUnitType === "kg"
                      ? " KG"
                      : productSelectUnitType === "mg"
                      ? " MG"
                      : productSelectUnitType === "unid"
                      ? " Unidades"
                      : productSelectUnitType}
                  </p>
                  <p>Valor do produto: {formatToBRL(productSelectPrice)}</p>
                </div>
              )}
              <div className="w-full items-center justify-center flex relative">
                <input
                  required={true}
                  type="text"
                  id="quantityValue"
                  maxLength={9}
                  placeholder=" "
                  value={quantity}
                  onChange={(event) => {
                    const onlyNumbers = event.target.value.replace(/\D/g, "");
                    if (onlyNumbers === "") {
                      setQuantity("");
                    } else if (parseInt(onlyNumbers) > productSelectQuantity) {
                      setQuantity(productSelectQuantity.toString());
                    } else {
                      setQuantity(onlyNumbers);
                    }
                  }}
                  className={`duration-200 outline-none text-base transition-all block border-2 px-2.5 pb-2.5 pt-4 w-full h-10 text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 hover:border-primaryColor focus:border-primaryColor peer `}
                />
                <label
                  htmlFor="quantityValue"
                  className={`absolute text-xs font-bold duration-300 transform text-gray-400 -translate-y-3 scale-90 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-90 peer-focus:-translate-y-3 left-3 `}
                >
                  Digite a quantidade
                </label>
              </div>
            </div>
            <div className="w-full px-0 py-0 mt-0.5 h-full">
              <div className="flex items-center gap-2">
                <div className="w-full items-center mt-3 justify-center flex relative">
                  <input
                    required={true}
                    type="text"
                    id="discountValuePercentage"
                    maxLength={5}
                    onChange={(event) => {
                      const input = event.target.value;
                      const regex = /^(\d+(\.\d{0,2})?)?$/;

                      if (input === "" || regex.test(input)) {
                        if (parseFloat(input) > 100) {
                          setDiscountPercentage("100");
                        } else {
                          setDiscountPercentage(input);
                        }
                      }
                    }}
                    value={discountPercentage}
                    placeholder=" "
                    className={`duration-200 outline-none text-base transition-all block border-2 px-2.5 pb-2.5 pt-4 w-full h-10 text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 hover:border-primaryColor focus:border-primaryColor peer `}
                  />
                  <label
                    htmlFor="discountValuePercentage"
                    className={`absolute text-xs font-bold duration-300 transform text-gray-400 -translate-y-3 scale-90 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-90 peer-focus:-translate-y-3 left-3 `}
                  >
                    Desconto em % (Opcional)
                  </label>
                </div>
                <div className="w-full items-center mt-3 justify-center flex relative">
                  <input
                    required={true}
                    type="text"
                    id="discountValueReal"
                    value={amount}
                    onChange={(event) => {
                      handleAmountChange(event);
                    }}
                    placeholder=" "
                    className={`duration-200 outline-none text-base transition-all block border-2 px-2.5 pb-2.5 pt-4 w-full h-10 text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 hover:border-primaryColor focus:border-primaryColor peer `}
                  />
                  <label
                    htmlFor="discountValueReal"
                    className={`absolute text-xs font-bold duration-300 transform text-gray-400 -translate-y-3 scale-90 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-90 peer-focus:-translate-y-3 left-3 `}
                  >
                    Desconto em R$ (Opcional)
                  </label>
                </div>
              </div>
              <div className="w-full relative mt-2">
                <div className="flex justify-center items-center">
                  <p className="text-sm text-gray-400 px-2 z-[50] bg-whiteTextColor -translate-y-0.5 font-bold">
                    Subtotal
                  </p>
                </div>
                <div className="absolute top-1/2 left-0 w-full border-b-2 border-gray-300 transform -translate-y-1/2"></div>
              </div>
              <div className="w-full h-fit flex mt-2 items-center px-2 justify-center flex-col">
                {productSelect && (
                  <div className="w-full flex items-center justify-between">
                    <p className="font-bold text-sm">Nome:</p>
                    <p className="font-bold text-sm">
                      {" "}
                      {productSelect.length > 40
                        ? `${productSelect.substring(0, 40)}...`
                        : productSelect}
                    </p>
                  </div>
                )}
                {quantity && (
                  <div className="w-full mt-1 flex items-center justify-between">
                    <p className="font-bold text-sm">Quantidade:</p>
                    <p className="font-bold text-sm">x{quantity}</p>
                  </div>
                )}
                {productSelectPrice && (
                  <div className="w-full mt-1 flex items-center justify-between">
                    <p className="font-bold text-sm">Preço:</p>
                    <p className="font-bold text-sm">
                      {formatToBRL(productSelectPrice)}
                    </p>
                  </div>
                )}
                {discountPercentage && (
                  <div className="w-full mt-1 flex items-center justify-between">
                    <p className="font-bold text-sm">Desconto em %:</p>
                    <p className="font-bold text-sm">{discountPercentage}%</p>
                  </div>
                )}
                {cleanAmount > 0 && (
                  <div className="w-full mt-1 flex items-center justify-between">
                    <p className="font-bold text-sm">Desconto em R$:</p>
                    <p className="font-bold text-sm">R$ {amount}</p>
                  </div>
                )}
                <div className="w-full mt-3 flex items-center border-t-2 py-2 justify-between">
                  <p className="font-bold text-sm">Total:</p>
                  <p className="font-bold text-sm">
                    {formatToBRL(
                      productSelectPrice * (quantity ? quantity : 1) -
                        (cleanAmount ? cleanAmount : 0) -
                        productSelectPrice *
                          (quantity ? quantity : 1) *
                          (discountPercentage ? discountPercentage / 100 : 0)
                    )}
                  </p>
                </div>
                <div
                  onClick={() => {
                    handleAddCart(
                      productSelect,
                      productSelectID,
                      quantity,
                      productSelectPrice * (quantity ? quantity : 1) -
                        (cleanAmount ? cleanAmount : 0) -
                        productSelectPrice *
                          (quantity ? quantity : 1) *
                          (discountPercentage ? discountPercentage / 100 : 0),
                      productSelectUnitType === "g"
                        ? " G"
                        : productSelectUnitType === "ml"
                        ? " ML"
                        : productSelectUnitType === "L"
                        ? " L"
                        : productSelectUnitType === "kg"
                        ? " KG"
                        : productSelectUnitType === "mg"
                        ? " MG"
                        : productSelectUnitType === "unid"
                        ? " Unidades"
                        : productSelectUnitType
                    );
                  }}
                  className={`w-full gap-2 text-xs hover:bg-opacity-50 duration-300 transition-all cursor-pointer h-8 bg-primaryColor rounded-md flex items-center justify-center font-bold text-white ${
                    productSelect === "" ||
                    quantity === "" ||
                    quantity === "0" ||
                    productSelectPrice * (quantity ? quantity : 1) -
                      (cleanAmount ? cleanAmount : 0) -
                      productSelectPrice *
                        (quantity ? quantity : 1) *
                        (discountPercentage ? discountPercentage / 100 : 0) <
                      1
                      ? "pointer-events-none bg-opacity-50"
                      : ""
                  }`}
                >
                  <FaCartArrowDown /> Adicionar
                </div>
              </div>
            </div>

            <div
              onClick={() => {
                const productDescriptions = arrayCart
                  .map(
                    (item) =>
                      `${item.quantityProduct} ${item.unitTypeProduct} de ${item.name}`
                  )
                  .join(" , ");

                addProductsToSytem(
                  `Venda ${new Date().toLocaleString(
                    "pt-BR"
                  )} | Produtos: ${productDescriptions}`
                );
              }}
              className={`w-[95%] h-12 rounded-md text-xs cursor-pointer gap-2 duration-300 transition-all hover:bg-opacity-50 flex items-center justify-center text-white font-bold bg-primaryColor ${
                arrayCart.length > 0 || !loadingRequest || !created
                  ? ""
                  : "pointer-events-none opacity-50"
              } ${
                arrayCart.reduce(
                  (sum, product) => sum + product.subtotalProduct,
                  0
                ) < 1
                  ? "pointer-events-none opacity-50"
                  : ""
              } ${
                created ? "bg-green-500 pointer-events-none bg-opacity-50" : ""
              }`}
            >
              {loadingRequest ? (
                <div className="ld text-2xl text-black ld-ring ld-spin"></div>
              ) : (
                <div className="flex items-center gap-2">
                  <BsFillCartCheckFill />{" "}
                  {created ? "Venda realizada!" : "Realizar venda"}
                </div>
              )}
            </div>
          </div>
          <div className="w-full px-3 py-3 h-full  border-2 rounded-lg bg-whiteTextColor shadow-xl">
            <div className=" overflow-y-auto h-[88%]">
              {arrayCart.map((product, index) => (
                <div
                  key={index}
                  className="w-full relative h-10 rounded-md mb-2 flex items-center text-black shadow-xl bg-gray-50 px-6 font-bold text-xs justify-between border-2"
                >
                  <div
                    onClick={() => {
                      setArrayCart((prevArrayCart) =>
                        prevArrayCart.filter((_, idx) => idx !== index)
                      );
                    }}
                    className="absolute cursor-pointer top-2 flex items-center hover:opacity-50 transition-all duration-300 justify-center right-1 w-5 h-5"
                  >
                    <IoRemoveCircleSharp size={20} className="text-red-500" />
                  </div>

                  <p className="w-44">
                    Produto:{" "}
                    {product.name.length > 15
                      ? `${product.name.substring(0, 15)}...`
                      : product.name}
                  </p>
                  <p className="w-32 text-left">
                    Quantidade: {product.quantityProduct}{" "}
                    {product.unitTypeProduct}
                  </p>
                  <p className="w-44">
                    Subtotal: {formatToBRL(product.subtotalProduct)}
                  </p>
                </div>
              ))}
            </div>
            <div className="w-full h-20 border-t-2 items-start flex flex-col justify-center">
              <div className="w-full items-center mt-0 flex justify-between px-2">
                <p className="font-bold">Total:</p>
                <p className="font-bold">
                  {formatToBRL(
                    arrayCart.reduce(
                      (sum, product) => sum + product.subtotalProduct,
                      0
                    )
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Alert
        FirstMessage={firstMessageError}
        SecondMessage={secondMessageError}
      />
    </div>
  );
};

export default Cashout;
