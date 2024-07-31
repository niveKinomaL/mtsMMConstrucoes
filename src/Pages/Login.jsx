import React, { useEffect, useState } from "react";
import NamesInfos from "../Configs/NamesInfos";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import Alert from "./Components/Alert";
import { useNavigate } from "react-router-dom";

const Login = () => {
  //CheckBearer
  useEffect(() => {
    if (localStorage.getItem("AuthorizationMTSBearer")) {
      navigate("/dashboard");
    } else {
      return;
    }
  }, []);
  //---------------
  const navigate = useNavigate();
  //Login
  const [UserName, setUserName] = useState("");
  const [Password, setPassword] = useState("");
  const [loggedMessage, setLoggedMessage] = useState("");
  const [loadingRequest, setLoadingRequest] = useState(false);

  const authPost = () => {
    setLoadingRequest(true);
    let data = {
      username: UserName,
      password: Password,
    };
    let config = {
      method: "POST",
      url: "http://localhost/API/auth.php",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        switch (response.status) {
          case 200:
            localStorage.setItem(
              "AuthorizationMTSBearer",
              response.data.data.bearer
            );
            setLoggedMessage(response.data.message);
            setTimeout(() => {
              setLoadingRequest(false);
              setLoggedMessage(null);
              navigate("/dashboard");
            }, 3000);
            break;
        }
      })
      .catch((error) => {
        switch (error.response && error.response.status) {
          default:
            setLoggedMessage(error.response.data.message);
            setTimeout(() => {
              setLoadingRequest(false);
              setLoggedMessage(null);
            }, 3000);
            break;
        }
      });
  };
  return (
    <div className="w-screen h-screen">
      <div className="flex min-h-full  flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login - {NamesInfos.projectName}
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto shadow-xl p-5 rounded-xl sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Usuário
              </label>
              <div className="mt-2">
                <input
                  id="user"
                  name="user"
                  type="text"
                  onChange={(event) => {
                    setUserName(event.target.value);
                  }}
                  value={UserName}
                  required
                  autoComplete="user"
                  className="block w-full rounded-md border-0 py-1.5 outline-none px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Senha
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  value={Password}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 outline-none px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                onClick={() => {
                  authPost();
                }}
                type="submit"
                className={`flex w-full justify-center rounded-md bg-primaryColor px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryColor ${
                  loadingRequest ||
                  UserName.trim().length < 1 ||
                  Password.trim().length < 1
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                Entrar
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Desenvolvido por{" "}
            <a
              href="https://kevinlamoni.netlify.app"
              className="font-semibold leading-6 text-primaryColor hover:opacity-50"
            >
              Kevin L. Soluções Digitais
            </a>
          </p>
        </div>
      </div>
      <Alert SecondMessage={loggedMessage} FirstMessage={"Autenticação"} />
    </div>
  );
};

export default Login;
