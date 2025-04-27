import React from "react";

const Table = () => {
  const transactions = [
    {
      product: "Apple Watch",
      customerName: "Anas Alqunaid",
      customerPhone: "+966 12345678",
      date: "01/01/2025 12:40PM",
    },
    {
      product: "Apple Watch",
      customerName: "Ahmed Ali",
      customerPhone: "+966 12345678",
      date: "05/01/2025 12:40PM",
    },
  ];

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Transaction Details
                </h2>
                <select className="py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none">
                  <option>January</option>
                </select>
              </div>
              {/* End Header */}

              {/* Table */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        Product
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        Customer Name
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        Customer Phone
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        Date
                      </span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-start">
                      <span className="text-xs font-semibold uppercase text-gray-600">
                        Type
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-x-2">
                          <img
                            src="https://via.placeholder.com/40"
                            alt="Product"
                            className="w-10 h-10 rounded-full"
                          />
                          <span className="text-sm text-gray-800">
                            {transaction.product}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-800">
                          {transaction.customerName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-800">
                          {transaction.customerPhone}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-800">
                          {transaction.date}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-x-2">
                          <button className="py-1 px-3 text-sm font-medium rounded-full border border-green-500 text-green-500 hover:bg-green-50">
                            Warranty
                          </button>
                          <button className="py-1 px-3 text-sm font-medium rounded-full border border-pink-500 text-pink-500 hover:bg-pink-50">
                            Exchange
                          </button>
                          <button className="py-1 px-3 text-sm font-medium rounded-full border border-gray-500 text-gray-500 hover:bg-gray-50">
                            Return
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* End Table */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
