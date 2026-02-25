import React from "react";
import { useNavigate } from "react-router-dom";

const user = JSON.parse(localStorage.getItem("user"));

const Account = () => {
  return (
    <div className="flex flex-col gap-2 p-8 sm:flex-row sm:items-center sm:gap-6 sm:py-4">
      <img
        className="mx-auto block h-24 w-24 rounded-full sm:mx-0 sm:shrink-0"
        src="https://static.vecteezy.com/system/resources/thumbnails/050/944/576/small/portrait-close-up-woman-face-wearing-scarf-black-and-white-tone-dramatic-effect-photo.JPG"
        alt=" black and white image for profile"
      />
      <div className="flex flex-col items-start sm:items-start">
        <div className="flex flex-col items-start space-y-1">
          {/* Name and Role - Statically aligned to the left/start */}
          <p className="text-xl font-semibold text-black leading-tight">
            Astha Patel
          </p>
          {/* <p className="text-lg font-medium text-gray-500">Intern</p> */}
          
          {/* 🔥 Show Name + Role */}
          {user && (
            <div className="text-gray-900 text-lg flex flex-col items-center">
              <span className="font-semibold">{user.name}</span>
              <span className="text-xs bg-stone-500 text-white px-2 py-1 rounded-lg">
                {user.role}
              </span>
            </div>
          )}

          {/* Button - Now aligned directly under the text */}
          <button className="mt-2 rounded-full border border-stone-200 px-4 py-1.5 text-sm text-stone-600 transition-all hover:border-transparent hover:bg-stone-600 hover:text-white active:bg-stone-700">
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
