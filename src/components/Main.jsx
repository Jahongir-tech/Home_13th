import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import USER from "../assets/user.png";
import { PatternFormat } from "react-number-format";
import { countries } from "countries-list";

const Main = () => {
  const [username, setUsername] = useState("");
  const password = useRef(null);
  const firstName = useRef(null);
  const lastName = useRef(null);
  const [country, setCountry] = useState(null);
  const [gender, setGender] = useState("Male");
  const birthdate = useRef(null);
  const [phone, setPhone] = useState("");

  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("data")) || []
  );
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    if (data.length) {
      localStorage.setItem("data", JSON.stringify(data));
    }
  }, [data]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (edit) {
      let updatedUser = {
        id: edit.id,
        firstName: firstName.current.value,
        lastName: lastName.current.value,
        username,
        password: password.current.value,
        country,
        gender,
        birthdate: birthdate.current.value,
        phone,
      };
      setData((prev) =>
        prev.map((item) => (item.id === edit.id ? updatedUser : item))
      );
      setEdit(null);
    } else {
      const newUser = {
        id: uuidv4(),
        firstName: firstName.current.value,
        lastName: lastName.current.value,
        username,
        password: password.current.value,
        country,
        gender,
        birthdate: birthdate.current.value,
        phone,
      };
      setData((prev) => [...prev, newUser]);
    }
    setUsername("");
    firstName.current.value = "";
    lastName.current.value = "";
    password.current.value = "";
    setCountry(COUNTRY_LIST[0]?.code || "");
    setGender("");
    birthdate.current.value = "";
    setPhone("");
  };

  const handleDelete = function (id) {
    if (confirm("are you sure?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (item) => {
    setUsername(item.username);
    password.current.value = item.password;
    firstName.current.value = item.firstName;
    lastName.current.value = item.lastName;
    setCountry(item.country);
    setEdit(item);
    setGender(item.gender);
    birthdate.current.value = item.birthdate;
    setPhone(item.phone);
  };

  const COUNTRY_LIST = Object.entries(countries).map(([code, info], index) => ({
    id: index + 1,
    country: info.name,
  }));

  return (
    <div onSubmit={handleSubmit} className="flex gap-5 font-roboto">
      <form className="w-80 p-5 bg-indigo-100 h-screen rounded shadow-xl text-[16px] font-[500]">
        <input
          ref={firstName}
          required
          className="w-full h-10 px-3 mb-3 bg-indigo-200 rounded shadow-md"
          type="text"
          placeholder="First Name"
        />
        <input
          ref={lastName}
          required
          className="w-full h-10 px-3 mb-3 bg-indigo-200 rounded shadow-md"
          type="text"
          placeholder="Last Name"
        />
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          className="w-full h-10 px-3 mb-3 bg-indigo-200 rounded shadow-md"
          type="text"
          placeholder="Username"
        />
        <input
          ref={password}
          required
          className="w-full h-10 px-3 mb-3 bg-indigo-200 rounded shadow-md"
          type="password"
          placeholder="Password"
          minLength={6}
        />
        <select
          onChange={(event) => setCountry(event.target.value)}
          id="country-select"
          name="country"
          className="w-full h-10 px-3 mb-3 bg-indigo-200 rounded-lg shadow-md cursor-pointer"
        >
          <option>Select your country</option>
          {COUNTRY_LIST.map((country) => (
            <option key={country.id} value={country.country}>
              {country.country}
            </option>
          ))}
        </select>
        <div className="flex justify-evenly mb-3 bg-indigo-300 h-10 rounded-xl">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={gender === "Male"}
              onChange={() => setGender("Male")}
              className="mr-2 cursor-pointer"
            />
            Male
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={gender === "Female"}
              onChange={() => setGender("Female")}
              className="mr-2 cursor-pointer"
            />
            Female
          </label>
        </div>
        <input
          ref={birthdate}
          type="date"
          required
          className="grid place-items-center w-full mb-3 bg-indigo-300 h-10 rounded-lg shadow-md cursor-pointer"
        />
        <PatternFormat
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          className="w-full mb-3 bg-indigo-200 h-10 text-center rounded-lg shadow-md"
          format="+998 (##) ### ## ##"
          allowEmptyFormatting
          mask="-"
        />
        <button className="w-full h-10 px-3 mb-3 text-[18px] bg-indigo-500 rounded-lg shadow-md hover:bg-[azure] hover:text-indigo-400 duration-200 hover:border-[1px] hover:border-indigo-400">
          Save
        </button>
      </form>
      <div className="flex-1 flex gap-3 flex-wrap items-start content-start py-5 text-[18px] font-[500]">
        {data?.map((item) => (
          <div
            key={item.id}
            className="w-72 p-3 shadow-lg bg-indigo-100 text-center flex flex-col gap-2 rounded-lg h-96"
          >
            <div className="w-20 h-20 bg-slate-300 rounded-full mx-auto overflow-hidden pt-2">
              <img src={USER} alt="user.png" />
            </div>
            <h3>
              {item.firstName} {item.lastName}
            </h3>
            <p>{item.birthdate}</p>
            <h3>{item.username}</h3>
            <p>{item.password.replace(/./g, "*")}</p>
            <p>{item.country}</p>
            <p>{item.gender}</p>
            <p>{item.phone}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => handleDelete(item.id)}
                className="w-20 h-10 bg-indigo-400 p-1 rounded-lg shadow-md hover:bg-[azure] hover:text-indigo-400 duration-200 hover:border-[1px] hover:border-indigo-400"
              >
                Delete
              </button>
              <button
                onClick={() => handleEdit(item)}
                className="w-20 h-10 bg-indigo-400 p-1 rounded-lg shadow-md hover:bg-[azure] hover:text-indigo-400 duration-200 hover:border-[1px] hover:border-indigo-400"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
