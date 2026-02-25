import React, { useEffect, useState } from "react";
import axios from "axios";
import BookForm from "./BookForm";
import Card from "./Card";
import { Plus, Funnel } from "lucide-react";

const api = axios.create({
  baseURL: "http://localhost:5000/book",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const Home = () => {
  /* ================= USER + PERMISSIONS ================= */

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const canAdd = role === "Admin" || role === "User";
  const canEdit = role === "Admin";
  const canDelete = role === "Admin";

  /* ================= STATES ================= */

  const [bookList, setBookList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState(false);
  const [selectedFilterField, setSelectedFilterField] =
    useState("Category");
  const [selectedFilterValue, setSelectedFilterValue] =
    useState("");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [showForm, setShowForm] = useState(false);

  const [bookForm, setBookForm] = useState({
    BookName: "",
    Author: "",
    Price: "",
    Category: "",
    Image: "",
    BookImage: null,
  });

  /* ================= FETCH BOOKS ================= */

  const fetchBooks = async () => {
    try {
      const { data } = await api.get("/booklists");
      setBookList(data?.Booklist || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  /* ================= PRICE RANGE ================= */

  const highestBookPrice = Math.max(
    ...bookList.map((b) => parseInt(b.Price) || 0),
    1000
  );

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "BookImage") {
      setBookForm({ ...bookForm, BookImage: files[0] });
    } else {
      setBookForm({ ...bookForm, [name]: value });
    }
  };

  const handleSubmit = async () => {
    if (!bookForm.BookName || !bookForm.Author || !bookForm.Price)
      return alert("Fill required fields");

    try {
      let imageURL = bookForm.Image || "";

      if (bookForm.BookImage) {
        const formData = new FormData();
        formData.append("image", bookForm.BookImage);

        const res = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageURL = res.data.imageUrl;
      }

      const finalData = { ...bookForm, Image: imageURL };

      const method = editingId ? "put" : "post";
      const url = editingId ? "/updatebook" : "/";
      const payload = editingId
        ? { _id: editingId, ...finalData }
        : finalData;

      const { data } = await api[method](url, payload);

      if (data?.Success) {
        alert(data.Message);
        resetForm();
        fetchBooks();
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setBookForm({
      BookName: "",
      Author: "",
      Price: "",
      Category: "",
      Image: "",
      BookImage: null,
    });
  };

  const handleEditInit = (book) => {
    setBookForm({
      BookName: book.BookName,
      Author: book.Author,
      Price: book.Price,
      Category: book.Category,
      Image: book.Image || "",
      BookImage: null,
    });

    setEditingId(book._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      const { data } = await api.post("/deletebook", { _id: id });
      if (data?.Success) fetchBooks();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FILTER LOGIC ================= */

  const getUniqueFilterValues = () => {
    const values = bookList.map(
      (book) => book[selectedFilterField]
    );
    return [...new Set(values)].filter(Boolean);
  };

  const filteredBooks =
    selectedFilterField === "Price"
      ? bookList.filter(
          (book) => parseInt(book.Price) <= maxPrice
        )
      : selectedFilterValue
      ? bookList.filter(
          (book) =>
            String(book[selectedFilterField]) ===
            String(selectedFilterValue)
        )
      : bookList;

  /* ================= JSX ================= */

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-stone-800">
        Your Book reading journey goes.....
      </h1>

      {/* Modal Form */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-[90%] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <BookForm
              bookForm={bookForm}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={() => {
                resetForm();
                setShowForm(false);
              }}
              editingId={editingId}
            />
          </div>
        </div>
      )}

      {/* Floating Buttons */}
      {canAdd && (
        <Plus
          className="fixed bottom-8 right-8 bg-stone-600 text-white rounded-full size-9 cursor-pointer"
          onClick={() => setShowForm(true)}
        />
      )}

      <Funnel
        className="fixed bottom-8 right-20 text-stone-600 size-9 cursor-pointer"
        onClick={() => {
          setFilter(!filter);
          setSelectedFilterValue("");
          setSelectedFilterField("Category");
          setMaxPrice(highestBookPrice);
        }}
      />

      {/* Filter Panel */}
      {filter && (
        <div className="mb-6 space-y-4">
          <div className="flex gap-3 items-center">
            <label className="text-stone-700 font-semibold">
              Filter by:
            </label>
            <select
              value={selectedFilterField}
              onChange={(e) => {
                setSelectedFilterField(e.target.value);
                setSelectedFilterValue("");
                setMaxPrice(highestBookPrice);
              }}
              className="px-4 py-2 border border-stone-300 rounded-lg"
            >
              <option value="Category">Category</option>
              <option value="Author">Author</option>
              <option value="Price">Price</option>
            </select>
          </div>

          {selectedFilterField === "Price" ? (
            <div className="w-full max-w-md">
              <label className="block mb-2 text-stone-700 font-semibold">
                Max Price: ₹{maxPrice}
              </label>
              <input
                type="range"
                min="0"
                max={highestBookPrice}
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(parseInt(e.target.value))
                }
                className="w-full accent-stone-700 cursor-pointer"
              />
            </div>
          ) : (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setSelectedFilterValue("")}
                className="px-4 py-2 rounded-full border"
              >
                All
              </button>

              {getUniqueFilterValues().map((value) => (
                <button
                  key={value}
                  onClick={() =>
                    setSelectedFilterValue(value)
                  }
                  className="px-4 py-2 rounded-full border"
                >
                  {value}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Book Cards */}
      <Card
        list={filteredBooks}
        onEdit={canEdit ? handleEditInit : null}
        onDelete={canDelete ? handleDelete : null}
      />
    </div>
  );
};

export default Home;



// import { React, useEffect, useState } from "react";
// import axios from "axios";
// import BookForm from "./BookForm";
// import Card from "./Card";
// import { Plus, Funnel } from "lucide-react";

// // const api = axios.create({ baseURL: "http://localhost:5000/book" });

// const api = axios.create({
//   baseURL: "http://localhost:5000/book",
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });

// const user = JSON.parse(localStorage.getItem("user"));
// const role = user?.role;
// const canAdd = role === "Admin" || role === "User";
// const canEdit = role === "Admin" || role === "User";
// const canDelete = role === "Admin";

// const Home = () => {
//   const [bookList, setBookList] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [filter, setFilter] = useState(false);

//   const [selectedFilterField, setSelectedFilterField] = useState("Category");
//   const [selectedFilterValue, setSelectedFilterValue] = useState("");

//   const [maxPrice, setMaxPrice] = useState(1000);

//   const [bookForm, setBookForm] = useState({
//     BookName: "",
//     Author: "",
//     Price: "",
//     Category: "",
//   });

//   const [showForm, setShowForm] = useState(false);

//   const fetchBooks = async () => {
//     try {
//       const { data } = await api.get("/booklists");
//       setBookList(data?.Booklist || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   // Dynamically detect highest book price
//   const highestBookPrice = Math.max(
//     ...bookList.map((b) => parseInt(b.Price) || 0),
//     1000,
//   );

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "BookImage") {
//       setBookForm({ ...bookForm, BookImage: files[0] });
//     } else {
//       setBookForm({ ...bookForm, [name]: value });
//     }
//   };

//   const handleSubmit = async () => {
//     if (!bookForm.BookName || !bookForm.Author || !bookForm.Price)
//       return alert("Fill required fields");

//     try {
//       let imageURL = bookForm.Image || "";

//       if (bookForm.BookImage) {
//         const formData = new FormData();
//         formData.append("image", bookForm.BookImage);

//         const res = await api.post("/upload", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });

//         imageURL = res.data.imageUrl;
//       }

//       const finalData = {
//         ...bookForm,
//         Image: imageURL,
//       };

//       const method = editingId ? "put" : "post";
//       const url = editingId ? "/updatebook" : "/";
//       const payload = editingId ? { _id: editingId, ...finalData } : finalData;

//       const { data } = await api[method](url, payload);

//       if (data?.Success) {
//         alert(data.Message);
//         resetForm();
//         fetchBooks();
//         setShowForm(false);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Action failed");
//     }
//   };

//   const resetForm = () => {
//     setEditingId(null);
//     setBookForm({
//       BookName: "",
//       Author: "",
//       Price: "",
//       Category: "",
//       Image: "",
//       BookImage: null,
//     });
//   };

//   const handleEditInit = (book) => {
//     setBookForm({
//       BookName: book.BookName,
//       Author: book.Author,
//       Price: book.Price,
//       Category: book.Category,
//       Image: book.Image || "",
//       BookImage: null,
//     });

//     setEditingId(book._id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this book?")) return;
//     const { data } = await api.post("/deletebook", { _id: id });
//     if (data?.Success) fetchBooks();
//   };

//   const getUniqueFilterValues = () => {
//     if (!selectedFilterField) return [];
//     const values = bookList.map((book) => book[selectedFilterField]);
//     return [...new Set(values)].filter(Boolean);
//   };

//   // Final filtering logic
//   const filteredBooks =
//     selectedFilterField === "Price"
//       ? bookList.filter((book) => parseInt(book.Price) <= maxPrice)
//       : selectedFilterValue
//         ? bookList.filter(
//             (book) =>
//               String(book[selectedFilterField]) === String(selectedFilterValue),
//           )
//         : bookList;

//   return (
//     <div className="container mx-auto p-8">
//       <h1 className="text-3xl font-bold mb-6 text-stone-800">
//         Your Book reading journey goes.....
//       </h1>

//       {/* Modal Form */}
//       {showForm && (
//         <div
//           className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
//           onClick={() => setShowForm(false)}
//         >
//           <div
//             className="bg-white rounded-lg shadow-lg w-[90%] max-w-4xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <BookForm
//               bookForm={bookForm}
//               onChange={handleChange}
//               onSubmit={handleSubmit}
//               onCancel={() => {
//                 resetForm();
//                 setShowForm(false);
//               }}
//               editingId={editingId}
//             />
//           </div>
//         </div>
//       )}

//       {/* Floating Buttons */}
//       {(role === "Admin" || role === "User") && (
//         <Plus
//           className="fixed bottom-8 right-8 bg-stone-600 text-white rounded-full size-9 cursor-pointer"
//           onClick={() => setShowForm(true)}
//         />
//       )}

//       <Funnel
//         className="fixed bottom-8 right-20 text-stone-600 size-9 cursor-pointer"
//         onClick={() => {
//           setFilter(!filter);
//           setSelectedFilterValue("");
//           setSelectedFilterField("Category");
//           setMaxPrice(highestBookPrice);
//         }}
//       />

//       {/* Filter Panel */}
//       {filter && (
//         <div className="mb-6 space-y-4">
//           <div className="flex gap-3 items-center">
//             <label className="text-stone-700 font-semibold">Filter by:</label>
//             <select
//               value={selectedFilterField}
//               onChange={(e) => {
//                 setSelectedFilterField(e.target.value);
//                 setSelectedFilterValue("");
//                 setMaxPrice(highestBookPrice);
//               }}
//               className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600"
//             >
//               <option value="Category">Category</option>
//               <option value="Author">Author</option>
//               <option value="Price">Price</option>
//             </select>
//           </div>

//           <div className="flex gap-3 flex-wrap items-center">
//             {selectedFilterField === "Price" ? (
//               <div className="w-full max-w-md">
//                 <label className="block mb-2 text-stone-700 font-semibold">
//                   Max Price: ₹{maxPrice}
//                 </label>

//                 <input
//                   type="range"
//                   min="0"
//                   max={highestBookPrice}
//                   value={maxPrice}
//                   onChange={(e) => setMaxPrice(parseInt(e.target.value))}
//                   className="w-full accent-stone-700 cursor-pointer"
//                 />

//                 <div className="flex justify-between text-sm text-stone-500 mt-1">
//                   <span>₹0</span>
//                   <span>₹{highestBookPrice}</span>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <button
//                   onClick={() => setSelectedFilterValue("")}
//                   className={`px-4 py-2 rounded-full border transition ${
//                     selectedFilterValue === ""
//                       ? "bg-stone-700 text-white"
//                       : "bg-white text-stone-700"
//                   }`}
//                 >
//                   All
//                 </button>

//                 {getUniqueFilterValues().map((value) => (
//                   <button
//                     key={value}
//                     onClick={() => setSelectedFilterValue(value)}
//                     className={`px-4 py-2 rounded-full border transition ${
//                       selectedFilterValue === String(value)
//                         ? "bg-stone-700 text-white"
//                         : "bg-white text-stone-700"
//                     }`}
//                   >
//                     {value}
//                   </button>
//                 ))}
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       <Card
//         list={filteredBooks}
//         onEdit={canEdit ? handleEditInit : null}
//         onDelete={canDelete ? handleDelete : null}
//       />
//     </div>
//   );
// };

// export default Home;
