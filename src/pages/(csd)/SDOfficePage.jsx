import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faEdit } from "@fortawesome/free-regular-svg-icons";
import { getAllSdOffices, validateToken } from "../../services/service";
import AddSDOfficeModal from "../../components/AddSDOfficeModal";
import UpdateUserModal from "../../components/UpdateUserModal"; // Import the UpdateUserModal

const SDOfficePage = () => {
    const [sdOffice, setSdOffices] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // New state to control update modal
    const [userId, setUserId] = useState(null); // State to track the user to update
    const [reload, setReload] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const runValidation = async () => {
            try {
                const isVerified = await validateToken();
                if (
                    !isVerified ||
                    localStorage.getItem("role").toString() !== "0"
                ) {
                    window.location.href = "/login";
                }
            } catch (error) {
                console.error("Error during token validation:", error);
                return {
                    error: "An error occurred during token validation.",
                };
            }
        };

        const getSDOffices = async () => {
            try {
                const sd_office = await getAllSdOffices();
                if (reload === true || searchQuery === "") {
                    setSdOffices(sd_office);
                }

                if (searchQuery !== "") {
                    const filteredSdOffice = sd_office.filter(
                        (sd_office) =>
                            sd_office.name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                            sd_office.email
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                            sd_office.campus_name
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase())
                    );
                    setSdOffices(filteredSdOffice);
                }

                setReload(false);
            } catch (error) {
                console.error("Error fetching SD Offices:", error);
                return {
                    error: "An error occurred while fetching SD Offices.",
                };
            }
        };

        runValidation();
        getSDOffices();
    }, [reload, searchQuery]);

    // Function to handle opening of update modal
    const handleEditClick = (id) => {
        setUserId(id); // Set the userId for the user to update
        setIsUpdateModalOpen(true); // Open the UpdateUserModal
    };

    return (
        <section className="h-screen flex">
            <Sidebar />
            <main className="h-full w-[80%] border overflow-auto">
                <div className="header py-5 px-7 flex justify-between items-center">
                    <h1 className="text-2xl text-gray-900">SD Office</h1>
                    <button
                        className="bg-blue-600 text-white text-base px-6 py-2"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <FontAwesomeIcon icon={faSquarePlus} /> Add New Office
                    </button>
                </div>
                <hr />
                <div className="py-5 px-7">
                    <div className="flex flex-wrap mb-4">
                        <input
                            className="form__input border block w-[16rem] px-6 py-4 rounded-md shadow-sm sm:text-sm focus:outline-none"
                            type="search"
                            placeholder="Search SD Office"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            value={searchQuery}
                        />
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-red-500">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Campus Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sdOffice ? (
                                sdOffice.map((row, index) => (
                                    <tr
                                        key={row.user_id}
                                        className={
                                            index % 2 === 0
                                                ? "bg-white hover:bg-red-200"
                                                : "bg-red-100 hover:bg-red-200"
                                        }
                                    >
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                            {row.name}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                            {row.email}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                            {row.campus_name}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-black">
                                            <button
                                                className="bg-red-500 text-white hover:bg-red-600 p-1.5 mr-2"
                                                onClick={() =>
                                                    handleEditClick(row.user_id)
                                                } // Call the handler to open the modal
                                            >
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        className="px-6 py-3 whitespace-nowrap text-sm font-medium"
                                        colSpan={5}
                                    >
                                        No Data Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {isAddModalOpen && (
                <AddSDOfficeModal
                    setIsAddModalOpen={setIsAddModalOpen}
                    setReload={setReload}
                />
            )}

            {/* Update Modal */}
            {isUpdateModalOpen && (
                <UpdateUserModal
                    userId={userId} // Pass the selected userId to UpdateUserModal
                    setIsUpdateModalOpen={setIsUpdateModalOpen} // Close modal function
                    setReload={setReload} // Reload data after update
                />
            )}
        </section>
    );
};

export default SDOfficePage;
