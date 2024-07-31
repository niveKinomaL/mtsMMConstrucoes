import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import axios from "axios";
import { IoAddCircle } from "react-icons/io5";
export default function AddProduct({ open, setOpen, getStock }) {
  const formatToBRL = (value) => {
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });

    // Format the value and remove the "R$ " from the beginning
    return formatter.format(value).replace(/^R\$\s?/, "");
  };

  const [amount, setAmount] = useState("0,00");
  const [bonusPercentage, setBonusPercentage] = useState(
    localStorage.getItem("bonusPercentage")
      ? localStorage.getItem("bonusPercentage")
      : 35
  );

  const handleAmountChange = (event) => {
    let rawValue = event.target.value.replace(/[^0-9]/g, "");
    if (parseInt(rawValue, 10) > 999999999) {
      rawValue = "999999999";
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
  //----
  const [amount2, setAmount2] = useState("0,00");
  const handleAmountChange2 = (event) => {
    let rawValue = event.target.value.replace(/[^0-9]/g, "");
    if (parseInt(rawValue, 10) > 999999999) {
      rawValue = "999999999";
    }

    while (rawValue.length > 3 && rawValue[0] === "0") {
      rawValue = rawValue.slice(1);
    }

    if (rawValue === "") {
      setAmount2("0,00");
      setAmount("0");
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

    // Convert rawValue to a number for calculation
    const cleanAmount = parseFloat(rawValue) / 100;
    const rawPart = cleanAmount * (bonusPercentage / 100) + cleanAmount;

    // Set the amount as a string
    setAmount(formatToBRL(rawPart.toString()));
    setAmount2(formattedValue);
  };

  const amountWithoutCommasAndDots2 = amount2.replace(/[.]/g, "");
  const cleanAmount2 = parseFloat(
    amountWithoutCommasAndDots2.replace(",", ".")
  );
  //-----------------------------------------------
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [typeProduct, setTypeProduct] = useState("");
  const AddProduct = () => {
    let data = {
      name: name,
      quantity: quantity,
      sell_price: cleanAmount,
      buy_price: cleanAmount2,
      unit_type: typeProduct.toLowerCase(),
    };
    let config = {
      method: "POST",
      url: "http://localhost/API/stockController.php",
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
            getStock();
            setName("");
            setQuantity("");
            setAmount("0,00");
            setAmount2("0,00");
            localStorage.setItem("bonusPercentage", bonusPercentage);
            setTypeProduct("");
            break;
        }
      })
      .catch((error) => {
        switch (error.response && error.response.status) {
          default:
            console.log(error.response);
            break;
        }
      });
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-4 sm:pb-4">
              <div className="sm:flex sm:items-center">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primaryColor bg-opacity-10 sm:mx-0 sm:h-10 sm:w-10">
                  <IoAddCircle
                    aria-hidden="true"
                    className="h-6 w-6 text-primaryColor"
                  />
                </div>
                <div className="mt-0 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Adicione um produto
                  </DialogTitle>
                </div>
              </div>
            </div>
            <div className="w-full p-4 border-t-2 gap-4 flex items-center flex-col justify-center">
              <div className="w-full items-center justify-center flex relative">
                <input
                  required={true}
                  type="text"
                  id="ProductName"
                  maxLength={255}
                  placeholder=" "
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  className={`duration-200 outline-none text-base transition-all block border-2 px-2.5 pb-2.5 pt-4 w-full h-12 text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 hover:border-primaryColor focus:border-primaryColor peer `}
                />
                <label
                  htmlFor="ProductName"
                  className={`absolute text-base duration-300 transform text-gray-500 -translate-y-4 scale-90 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-90 peer-focus:-translate-y-4 left-3 `}
                >
                  Digite o nome do produto
                </label>
              </div>
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
                    setQuantity(onlyNumbers);
                  }}
                  className={`duration-200 outline-none text-base transition-all block border-2 px-2.5 pb-2.5 pt-4 w-full h-12 text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 hover:border-primaryColor focus:border-primaryColor peer `}
                />
                <label
                  htmlFor="quantityValue"
                  className={`absolute text-base duration-300 transform text-gray-500 -translate-y-4 scale-90 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-90 peer-focus:-translate-y-4 left-3 `}
                >
                  Digite a quantidade
                </label>
              </div>

              <div className="flex w-full items-center gap-2">
                <div className="w-full items-center justify-center flex relative">
                  <input
                    required={true}
                    type="text"
                    id="buyPrice"
                    placeholder=" "
                    value={amount2}
                    onChange={(event) => {
                      handleAmountChange2(event);
                    }}
                    className={`duration-200 outline-none text-base transition-all block border-2 px-2.5 pb-2.5 pt-4 w-full h-12 text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 hover:border-primaryColor focus:border-primaryColor peer `}
                  />
                  <label
                    htmlFor="buyPrice"
                    className={`absolute text-base duration-300 transform text-gray-500 -translate-y-4 scale-90 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-90 peer-focus:-translate-y-4 left-3 `}
                  >
                    Digite o valor de compra
                  </label>
                </div>
                <div className="w-full items-center justify-center flex relative">
                  <input
                    required={true}
                    type="text"
                    id="bonusPrice"
                    placeholder=" "
                    onChange={(event) => {
                      const input = event.target.value;
                      const regex = /^(\d+(\.\d{0,2})?)?$/;
                      setAmount("0,00");
                      setAmount2("0,00");
                      if (input === "" || regex.test(input)) {
                        if (parseFloat(input) > 100) {
                          setBonusPercentage("100");
                        } else {
                          setBonusPercentage(input);
                        }
                      }
                    }}
                    value={bonusPercentage}
                    className={`duration-200 outline-none text-base transition-all block border-2 px-2.5 pb-2.5 pt-4 w-full h-12 text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 hover:border-primaryColor focus:border-primaryColor peer `}
                  />
                  <label
                    htmlFor="bonusPrice"
                    className={`absolute text-base duration-300 transform text-gray-500 -translate-y-4 scale-90 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-90 peer-focus:-translate-y-4 left-3 `}
                  >
                    Digite a % de lucro
                  </label>
                </div>
              </div>
              <div className="w-full items-center justify-center flex relative">
                <input
                  required={true}
                  type="text"
                  id="sellPrice"
                  placeholder=" "
                  value={amount}
                  onChange={(event) => {
                    handleAmountChange(event);
                  }}
                  className={`duration-200 outline-none text-base transition-all block border-2 px-2.5 pb-2.5 pt-4 w-full h-12 text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 hover:border-primaryColor focus:border-primaryColor peer `}
                />
                <label
                  htmlFor="sellPrice"
                  className={`absolute text-base duration-300 transform text-gray-500 -translate-y-4 scale-90 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-90 peer-focus:-translate-y-4 left-3 `}
                >
                  Digite o valor de venda
                </label>
              </div>
              <div className="w-full items-center justify-center flex relative">
                <input
                  required={true}
                  type="text"
                  id="unitType"
                  placeholder=" "
                  value={typeProduct}
                  onChange={(event) => {
                    setTypeProduct(event.target.value);
                  }}
                  className={`duration-200 outline-none text-base transition-all block border-2 px-2.5 pb-2.5 pt-4 w-full h-12 text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 hover:border-primaryColor focus:border-primaryColor peer `}
                />
                <label
                  htmlFor="unitType"
                  className={`absolute text-base duration-300 transform text-gray-500 -translate-y-4 scale-90 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-90 peer-focus:-translate-y-4 left-3 `}
                >
                  Digite o tipo de produto (KG, MG, G, UNID, L)
                </label>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  AddProduct();
                }}
                disabled={
                  name.length < 2 ||
                  quantity.length < 1 ||
                  (typeProduct.toLowerCase() !== "l" &&
                    typeProduct.toLowerCase() !== "mg" &&
                    typeProduct.toLowerCase() !== "kg" &&
                    typeProduct.toLowerCase() !== "ml" &&
                    typeProduct.toLowerCase() !== "g" &&
                    typeProduct.toLowerCase() !== "unid")
                }
                className={`inline-flex w-full justify-center rounded-md bg-primaryColor px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-opacity-50 sm:ml-3 sm:w-auto ${
                  name.length < 2 ||
                  quantity.length < 1 ||
                  (typeProduct.toLowerCase() !== "l" &&
                    typeProduct.toLowerCase() !== "mg" &&
                    typeProduct.toLowerCase() !== "kg" &&
                    typeProduct.toLowerCase() !== "ml" &&
                    typeProduct.toLowerCase() !== "g" &&
                    typeProduct.toLowerCase() !== "unid")
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                Adicionar
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancelar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
