import React from "react";
import { MdDelete } from "react-icons/md";
import { FaPen } from "react-icons/fa";

const Card = ({ list = [], onEdit, onDelete }) => {
  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-[#F1E5D1] p-6 rounded-xl">
      {list.map((book) => (
        <div
          key={book._id}
          className="bg-[#fdfbf8] shadow-md rounded-xl p-5 hover:shadow-lg transition-all border border-gray-100 flex flex-col justify-between"
        >
          {/* Image Section */}
          <div className="w-full h-64 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
            <img
              src={
                book.Image || "https://via.placeholder.com/150?text=No+Image"
              }
              alt={book.BookName}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>

          {/* Content Section */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-[#987070] mb-2">
              {book.BookName}
            </h2>

            <p className="text-[#987070]">
              <span className="font-medium">Author:</span> {book.Author}
            </p>

            <p className="text-[#987070]">
              <span className="font-medium">Price:</span> ₹{book.Price}
            </p>

            <p className="text-[#987070] mb-4">
              <span className="font-medium">Category:</span> {book.Category}
            </p>
          </div>

          {/* Action Buttons */}
          {(onEdit || onDelete) && (
            <div className="flex gap-4 items-center justify-end mt-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(book)}
                  className="text-[#C39898] hover:text-[#987070] transition"
                >
                  <FaPen size={18} />
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(book._id)}
                  className="text-[#C39898] hover:text-red-500 transition"
                >
                  <MdDelete size={20} />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Card;