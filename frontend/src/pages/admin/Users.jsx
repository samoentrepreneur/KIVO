import { useEffect, useState } from 'react';
import { User, Mail, Phone, Calendar, Shield, ShieldCheck, Clock, ArrowLeft, BadgeCheck } from 'lucide-react';
import api from '../../api';


export default function Users() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("");
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);


    const fetchUsersList = async (pageNo = 1, reset = false) => {
        try {
            if (isFirstLoad) {
                setInitialLoading(true);
            } else if (reset) {
                setLoadingMore(true); 
            } else {
                setLoadingMore(true); 
            }

            const res = await api.get("/admin/users/users-list", {
                params: { page: pageNo, limit: 10, search },
            });

            if (res.data?.success) {
                setUsers(prev =>
                    reset ? res.data.users : [...prev, ...res.data.users]
                );
                setHasMore(res.data.pagination.hasMore);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setInitialLoading(false);
            setLoadingMore(false);
            setIsFirstLoad(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(1);
            fetchUsersList(1, true);
        }, 400); 

        return () => clearTimeout(timer);
    }, [search]);


    const loadMore = () => {
        if (loadingMore || !hasMore) return;

        const nextPage = page + 1;
        setPage(nextPage);
        fetchUsersList(nextPage);
    };



    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };


    // useEffect(() => {
    //     console.log(selectedUser)
    // }, [selectedUser]);

    if (selectedUser) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                <div className=" w-full">
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-600 mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Users</span>
                    </button>

                    <div className="bg-white rounded-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-900 to-blue-950 p-4 md:p-6 text-white">
                            <div className="flex items-center gap-2 md:gap-4">
                                <div className="w-15 h-15 md:w-20 md:h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                                    {selectedUser.avatar ? (
                                        <img src={selectedUser.avatar} alt={selectedUser.fullName} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        getInitials(selectedUser.fullName)
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">{selectedUser.fullName}  {selectedUser.isVerifiedBadge && (
                                        <BadgeCheck   size={20} />
                                    )}</h1>
                                    <p className="text-blue-100 text-xs md:text-sm">User ID: {selectedUser._id}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4  p-4 md:p-6">
                            <h2 className="text-md md:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Statistics</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-gray-900">{selectedUser.orders.length}</p>
                                    <p className="text-sm text-gray-500">Total Orders</p>
                                </div>
                                {/* <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-gray-900">0</p>
                                    <p className="text-sm text-gray-500">Active Orders</p>
                                </div> */}
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                    <p className="text-2xl font-bold text-gray-900">G-{selectedUser.totalAmountSpent}</p>
                                    <p className="text-sm text-gray-500">Total Spent</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 md:p-6 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h2 className="text-md md:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Contact Information</h2>

                                    <div className="flex items-start gap-3">
                                        <Mail className="text-gray-400 mt-1" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-900">{selectedUser.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="text-gray-400 mt-1" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="text-gray-900">{selectedUser.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h2 className="text-md md:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Account Status</h2>

                                    <div className="flex items-start gap-3">
                                        <Shield className="text-gray-400 mt-1" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Verification Status</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedUser.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {selectedUser.isVerified ? 'Verified' : 'Not Verified'}
                                                </span>
                                                {selectedUser.isVerifiedBadge && (
                                                    <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500">
                                                        <BadgeCheck size={12} className="text-white" />
                                                    </div>

                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <User className="text-gray-400 mt-1" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Account Status</p>
                                            <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${selectedUser.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {selectedUser.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-md md:text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Activity & Security</h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Clock className="text-gray-400 mt-1" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Last Active</p>
                                            <p className="text-gray-900">{formatDate(selectedUser.lastActive)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Shield className="text-gray-400 mt-1" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Login Attempts</p>
                                            <p className={`font-medium ${selectedUser.loginAttempts > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                                                {selectedUser.loginAttempts}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="text-gray-400 mt-1" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Created At</p>
                                            <p className="text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Calendar className="text-gray-400 mt-1" size={20} />
                                        <div>
                                            <p className="text-sm text-gray-500">Updated At</p>
                                            <p className="text-gray-900">{formatDate(selectedUser.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                           
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (initialLoading && isFirstLoad) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }


    return (

        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="w-full">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Users</h1>
                    <div className="h-1 w-12 bg-blue-600 mt-2"></div>
                    <p className="text-gray-600 mt-1">Total Users: {users.length}</p>
                </div>
                <input
                    type="text"
                    placeholder="Search by name, email or phone"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-80 px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                {loadingMore && (
                    <div className="mt-2 text-sm text-gray-500 mb-4">Searching...</div>
                )}

                <div className="bg-white rounded-lg shadow  overflow-hidden">

                    {/* ==== DESKTOP TABLE ==== */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr
                                        key={user._id}
                                        onClick={() => setSelectedUser(user)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        getInitials(user.fullName)
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.fullName}</p>
                                                    <p className="text-sm text-gray-500">{user._id.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">{user.email}</p>
                                            <p className="text-sm text-gray-500">{user.phone}</p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium w-fit ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                    {user.isBlocked ? 'Blocked' : 'Active'}
                                                </span>

                                                {user.isVerifiedBadge && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 w-fit">
                                                        <ShieldCheck size={12} />
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {formatDate(user.lastActive)}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {formatDate(user.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                    {/* ==== MOBILE CARD VIEW ==== */}
                    <div className="md:hidden  divide-y divide-gray-200">
                        {users.map((user) => (
                            <div
                                key={user._id}
                                onClick={() => setSelectedUser(user)}
                                className="bg-white p-4 cursor-pointer"
                            >

                                {/* Header */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            getInitials(user.fullName)
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">{user.fullName}</p>
                                        <p className="text-xs text-gray-500">{user._id.slice(-8)}</p>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="text-sm space-y-1 text-gray-600">
                                    <p><span className="font-medium text-gray-800">Email:</span> {user.email}</p>
                                    <p><span className="font-medium text-gray-800">Phone:</span> {user.phone || 'N/A'}</p>
                                    <p><span className="font-medium text-gray-800">Status:</span>
                                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {user.isBlocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </p>
                                    {user.isVerifiedBadge && (
                                        <p className="text-blue-600 flex items-center gap-1 text-xs">
                                            <ShieldCheck size={13} /> Verified user
                                        </p>
                                    )}
                                    <p><span className="font-medium text-gray-800">Last Active:</span> {formatDate(user.lastActive)}</p>
                                    <p><span className="font-medium text-gray-800">Joined:</span> {formatDate(user.createdAt)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    

                </div>
                {hasMore && (
                    <div className="flex justify-center py-6">
                        {loadingMore ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        ) : (
                            <button
                                onClick={loadMore}
                                    className="px-6 py-2 bg-gray-200 text-black border rounded-full hover:text-blue-700 transition-all cursor-pointer"
                            >
                                Load More
                            </button>
                        )}
                    </div>
                )}
                {!initialLoading && users.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No users found
                    </div>
                )}

            </div>
        </div>

    );
}