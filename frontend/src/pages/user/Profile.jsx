import React, { useState, useEffect } from 'react';
import {
    ShoppingBag, CreditCard, ChevronRight,
    Mail, Phone, Calendar,
    ShoppingCart,
    LogOut,
    BadgeCheck
} from 'lucide-react';
import UserAvatar1 from "../../assets/avatar/user_avatar_2.png";
import LogoutModal from '../../modal/LogoutModal';
import { useUserAuth } from '../../context/user.authContext';
import { useNavigate } from 'react-router-dom';
import EditUserModal from '../../modal/EditUserModal';
import api from '../../api';
import toast from 'react-hot-toast';

const ProfileSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto -mt-2 md:py-8 md:px-8">
                {/* Profile Header Card Skeleton */}
                <div className="bg-white md:rounded-xl overflow-hidden mb-8 animate-pulse">
                    {/* Cover Image Skeleton */}
                    <div className="bg-gray-200 h-22 relative">
                        <div className="absolute -bottom-10 left-4 md:left-8">
                            <div className="h-18 w-18 md:h-22 md:w-22 rounded-full border-2 border-white shadow bg-gray-300"></div>
                        </div>
                    </div>

                    <div className="pt-12">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-8">
                            <div className="flex-1">
                                {/* Name Skeleton */}
                                <div className="w-40 h-7 bg-gray-200 rounded mb-3"></div>

                                {/* Contact Info Skeleton */}
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                                        <div className="w-48 h-4 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                                        <div className="w-32 h-4 bg-gray-200 rounded"></div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                                        <div className="w-44 h-4 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Button Skeleton */}
                            <div className="mt-6 md:mt-0">
                                <div className="w-28 h-9 bg-gray-200 rounded-full"></div>
                            </div>
                        </div>

                        {/* Stats Skeleton */}
                        <div className="grid grid-cols-2 gap-6 mt-10 border-t border-gray-100 py-6 px-4 md:px-8 divide-x divide-gray-100">
                            <div>
                                <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="w-16 h-8 bg-gray-200 rounded"></div>
                            </div>
                            <div className="pl-6">
                                <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="w-20 h-8 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu List Skeleton */}
                <div className="bg-white md:rounded-xl overflow-hidden animate-pulse">
                    {/* Title Skeleton */}
                    <div className="p-4 md:p-6 border-b border-gray-100">
                        <div className="w-32 h-6 bg-gray-200 rounded"></div>
                    </div>

                    {/* Menu Items Skeleton */}
                    {[1, 2, 3, 4].map((item, idx) => (
                        <div
                            key={idx}
                            className={`flex items-center justify-between p-4 md:p-6 border-b border-gray-100 ${idx === 3 ? 'border-b-0' : ''}`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                                <div className="w-24 h-5 bg-gray-200 rounded"></div>
                            </div>
                            <div className="w-5 h-5 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const Profile = () => {
    const [isProfileError, setProfileError] = useState(false);
    const [logoutModal, setShowLogOutModal] = useState(false);
    const { user, logout, fetchMe } = useUserAuth();
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    const [isUserProfileEditModalOpen, setUserProfileEditModalOpen] = useState();
    const [userProfileEditLoading, setUserEditProfileLoading] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                await fetchMe();
                document.title = user.fullName;

            } catch (err) {
                console.log(err)
            }
            finally {
                setLoading(false);
            }
        }
        fetchUserDetails();

    }, []);

    const updateProfile = async (data) => {
        try {
            setUserEditProfileLoading(true);
            const res = await api.post("/user/edit-profile", {
                fullName: data.name,
                phone:data.phone
            });
            if (res.data.success) {
                
                toast.success("Your profile updated successfully");
                await fetchMe()
                setUserProfileEditModalOpen(false);
            }


        } catch (err) {
            console.error(err);
            toast.error(err.response.data.message);
        }
        finally {
            setUserEditProfileLoading(false);

        }
    }

    if (loading) return <ProfileSkeleton />


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto -mt-2 md:py-8 md:px-8">
                {/* Profile Header Card */}
                <div className="bg-white md:rounded-xl overflow-hidden mb-8">
                    <div className="bg-blue-950 dark:bg-gray-900 h-22 relative">
                        <div className="absolute -bottom-10 left-4 md:left-8">
                            <div
                                className="h-18 w-18 md:h-22 md:w-22 rounded-full border-2 border-white shadow overflow-hidden cursor-pointer hover:scale-110 transition-all duration-300 flex items-center justify-center bg-gray-200 text-gray-700 font-semibold"
                            >
                                {user?.avatar && !isProfileError ? (
                                    <img
                                        src={user.avatar}
                                        onError={() => setProfileError(true)}
                                        className="w-full h-full object-cover"
                                        alt="Profile"
                                    />
                                ) : user?.fullName ? (
                                    <span className='text-3xl'>{user.fullName.charAt(0).toUpperCase()}</span>
                                ) : (
                                    <img src={UserAvatar1} className="w-full h-full object-cover" alt="default" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 ">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-8">
                            <div>
                                <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900">{user.fullName} {user.isVerifiedBadge && (
                                        <BadgeCheck size={20} color='blue' className="text-white" />

                                )}</h1>
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                    {user.phone && <div className="flex items-center text-gray-600">
                                        <Phone className="w-4 h-4 mr-2" />
                                        <span className="text-sm">{user.phone}</span>
                                    </div>}
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span className="text-sm">
                                            Member since {new Date(user?.createdAt).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>


                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 md:mt-0">
                                <button onClick={()=>setUserProfileEditModalOpen(true)} className="bg-blue-600 text-white text-sm px-4 cursor-pointer py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors">
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-10 border-t border-gray-100 py-6 px-4 md:px-8 md:px-0 divide-x divide-gray-100">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900 mt-2">{user.orders?.length}</p>
                                <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900 mt-2">G-{user?.totalAmountSpents}</p>
                                <p className="text-sm text-gray-500 font-medium">Total Amount Spent</p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Menu List */}
                <div className="bg-white md:rounded-xl overflow-hidden">
                    <h2 className="text-xl font-bold text-gray-900 p-4 md:p-6 border-b border-gray-100">Quick Actions</h2>
                    {[
                        { icon: ShoppingBag, label: 'My Orders', onClick: () => navigate('/my-orders') },
                        { icon: CreditCard, label: 'Payment Cards', },
                        { icon: ShoppingCart, label: 'Cart', onClick: () => navigate("/cart") },
                        { icon: LogOut, label: 'Logout', onClick: () => setShowLogOutModal(true) },
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            onClick={item.onClick}
                            className="w-full flex items-center justify-between text-gray-800 p-4 md:p-6 hover:bg-gray-100 transition-colors border-b border-gray-100 last:text-red-400 last:border-b-0"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12  rounded-xl flex items-center justify-center">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <span className="font-semibold ">{item.label}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    ))}
                </div>
            </div>
            {logoutModal && <LogoutModal isOpen={logoutModal} onClose={() => setShowLogOutModal(false)} onConfirm={logout} isLoading={loading} />}
            <EditUserModal
                open={isUserProfileEditModalOpen}
                onClose={() => setUserProfileEditModalOpen(false)}
                loading={userProfileEditLoading}
                user={user}
                onSave={(data) => updateProfile(data)}
            />
        </div >
    );
};

export default Profile;