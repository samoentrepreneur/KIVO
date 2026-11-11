import React, { useState, useEffect } from 'react';
import { Activity, User, Clock, MapPin, Monitor, ArrowLeft, Mail, Shield, Calendar, MonitorSmartphone, ShieldCheck, Search, History } from 'lucide-react';
import { useAuth } from '../../context/admin.authContext';
import toast from 'react-hot-toast';
import api from '../../api';

const ActivityLogs = () => {

   
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [query, setQuery] = useState(""); // for debounce
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const { admin } = useAuth();
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchLogs = async (nextPage = 1, reset = false) => {
        try {
            if (reset) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const res = await api.get(`/admin/logs`, {
                params: {
                    page: nextPage,
                    limit: 10,
                    adminId: admin._id,
                    search: query,
                },
            });

            if (res.data.success) {
                setLogs(prev => (reset ? res.data.logs : [...prev, ...res.data.logs]));
                setHasMore(res.data.hasMore);
            }

        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to load logs");
        } finally {
            if (reset) {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    };


    // Initial load
    useEffect(() => {
        fetchLogs(1, true);
    }, [query]);

    // Debounce search input
    useEffect(() => {
        const delay = setTimeout(() => {
            setQuery(search);
            setPage(1);
        }, 500);

        return () => clearTimeout(delay);
    }, [search]);

    const loadMore = () => {
        const next = page + 1;
        setPage(next);
        fetchLogs(next, false);
    };

    const [selectedLog, setSelectedLog] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    };

    const parseUserAgent = (ua = "") => {
        ua = ua.toLowerCase();

        if (ua.includes("iphone")) return { os: "iPhone (iOS)" };
        if (ua.includes("ipad")) return { os: "iPadOS" };
        if (ua.includes("android")) return { os: "Android" };
        if (ua.includes("macintosh") || ua.includes("mac os")) return { os: "macOS" };
        if (ua.includes("windows")) return { os: "Windows" };
        if (ua.includes("linux")) return { os: "Linux" };
        if (ua.includes("cros")) return { os: "ChromeOS" };
        if (ua.includes("smart-tv") || ua.includes("tizen") || ua.includes("tv")) return { os: "Smart TV" };
        if (ua.includes("googlebot") || ua.includes("bingbot") || ua.includes("crawler") || ua.includes("spider")) return { os: "Search Bot" };

        return { os: "Unknown" };
    };

    const getActionType = (action = "") => {
        const text = action.toLowerCase();

        if (text.includes("created") || text.includes("added")) return "create";
        if (text.includes("logged in") || text.includes("login")) return "login";
        if (text.includes("logged out") || text.includes("logout")) return "logout";
        if (text.includes("updated") || text.includes("edited") || text.includes("modified")) return "update";
        if (text.includes("deleted") || text.includes("removed")) return "delete";

        if (text.includes("password reset") || text.includes("password changed") || text.includes("password updated"))
            return "password reset";

        if (text.includes("login OTP") || text.includes("verification code") || text.includes("sent code"))
            return "otp";

        if (text.includes("role changed") || text.includes("role updated"))
            return "role_change";

        if (text.includes("permission") || text.includes("access updated"))
            return "permission";

        if (text.includes("locked")) return "locked";
        if (text.includes("unlocked")) return "unlocked";

        return "other";
    };


    const getActionColor = (type) => {
        switch (type) {
            case 'create': return 'bg-green-100 text-green-700';
            case 'login': return 'bg-blue-100 text-blue-700';
            case 'update': return 'bg-yellow-100 text-yellow-700';
            case 'delete': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role.toLowerCase()) {
            case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'moderator': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'user': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const handleBack = () => {
        setSelectedLog(null);
    };

    if (selectedLog) {
        const uaInfo = selectedLog.userAgent ? parseUserAgent(selectedLog.userAgent) : null;
        const actionType = selectedLog.action ? getActionType(selectedLog.action) : null;

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 md:p-6">
                <div className="w-full">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 mb-6 cursor-pointer py-2 text-slate-700 hover:text-blue-600 transition-all duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back to Logs</span>
                    </button>

                    <div>
                        <div>
                            <h2 className="text-2xl font-bold text-black">Activity Log Details</h2>
                            <p className="text-gray-600 text-sm mt-1">Complete information about this activity</p>
                        </div>

                        <div className="py-8 space-y-8">
                            {/* Admin Information */}
                            {(selectedLog.admin || selectedLog.adminId) && (
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                    <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                        <User className="w-6 h-6 text-blue-600" />
                                        Admin Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Full Name + Avatar */}
                                        {selectedLog.admin?.name && (
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                    Full Name
                                                </label>
                                                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-blue-100">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                                                        {selectedLog.admin.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .toUpperCase()}
                                                    </div>
                                                    <p className="text-slate-800 font-medium">{selectedLog.admin.name}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Role */}
                                        {selectedLog.admin?.role && (
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                    Role
                                                </label>
                                                <div className="bg-white p-3 rounded-lg border border-blue-100">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getRoleBadgeColor(
                                                            selectedLog.admin.role
                                                        )}`}
                                                    >
                                                        <ShieldCheck className="w-4 h-4 mr-2" />
                                                        {selectedLog.admin.role.charAt(0).toUpperCase() +
                                                            selectedLog.admin.role.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Email */}
                                        {selectedLog.admin?.email && (
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                    Email Address
                                                </label>
                                                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-blue-100">
                                                    <Mail className="w-5 h-5 text-slate-400" />
                                                    <p className="text-slate-800">{selectedLog.admin.email}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Admin Created Date */}
                                        {selectedLog.admin?.createdAt && (
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                    Admin Created Date
                                                </label>
                                                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-blue-100">
                                                    <Calendar className="w-5 h-5 text-slate-400" />
                                                    <p className="text-slate-800">{formatDate(selectedLog.admin.createdAt)}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Admin ID */}
                                        {selectedLog.adminId && (
                                            <div className="md:col-span-2">
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                    Admin ID
                                                </label>
                                                <p className="text-sm font-mono text-slate-700 bg-white px-4 py-3 rounded-lg border border-blue-100 break-all">
                                                    {selectedLog.adminId}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Details */}
                            {(selectedLog.action || actionType) && (
                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                                    <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                        <Activity className="w-6 h-6 text-amber-600" />
                                        Action Details
                                    </h3>
                                    <div className="space-y-4">
                                        {actionType && (
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                    Action Type
                                                </label>
                                                <span
                                                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${getActionColor(
                                                        actionType
                                                    )}`}
                                                >
                                                    {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                                                </span>
                                            </div>
                                        )}

                                        {selectedLog.action && (
                                            <div>
                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                    Action Description
                                                </label>
                                                <p className="text-slate-800 bg-white p-4 rounded-lg border border-amber-100 leading-relaxed">
                                                    {selectedLog.action}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Technical Details */}
                            {(selectedLog.id ||
                                selectedLog.ip ||
                                selectedLog.userAgent ||
                                selectedLog.createdAt ||
                                typeof selectedLog.__v !== "undefined") && (
                                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-6 border border-slate-300">
                                        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                            <MonitorSmartphone className="w-6 h-6 text-slate-600" />
                                            Technical Details
                                        </h3>
                                        <div className="space-y-4">
                                            {/* Log ID */}
                                            {selectedLog.id && (
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                        Log ID
                                                    </label>
                                                    <p className="text-sm font-mono text-slate-700 bg-white p-4 rounded-lg border border-slate-200 break-all">
                                                        {selectedLog.id}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* IP */}
                                                {selectedLog.ip && (
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                            IP Address
                                                        </label>
                                                        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-slate-200">
                                                            <MapPin className="w-5 h-5 text-slate-400" />
                                                            <p className="text-sm font-mono text-slate-700">{selectedLog.ip}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Device / OS */}
                                                {uaInfo?.os && (
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                            Device / OS
                                                        </label>
                                                        <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-slate-200">
                                                            <MonitorSmartphone className="w-5 h-5 text-slate-400" />
                                                            <p className="text-sm text-slate-700">
                                                                {uaInfo.icon} {uaInfo.os}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Timestamp */}
                                            {selectedLog.createdAt && (
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                        Timestamp
                                                    </label>
                                                    <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-slate-200">
                                                        <Clock className="w-5 h-5 text-slate-400" />
                                                        <p className="text-sm text-slate-700">{formatDate(selectedLog.createdAt)}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* User Agent */}
                                            {selectedLog.userAgent && (
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                        User Agent
                                                    </label>
                                                    <p className="text-sm font-mono text-slate-700 bg-white p-4 rounded-lg border border-slate-200 break-all">
                                                        {selectedLog.userAgent}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Version */}
                                            {typeof selectedLog.__v !== "undefined" && (
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                                                        Version
                                                    </label>
                                                    <p className="text-sm font-mono text-slate-700 bg-white p-4 rounded-lg border border-slate-200">
                                                        v{selectedLog.__v}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-2 md:p-6">
            <div className="w-full">
                <div className="mb-8">
                    <div className="mb-2">
                        <h1 className="text-3xl font-bold text-slate-800">Activity Logs</h1>
                        <div className="h-1 w-12 bg-blue-600 mt-2"></div>
                    </div>
                    <p className="text-slate-600">Track and monitor all administrative actions</p>
                </div>
                <div className="bg-white flex items-center gap-3 border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full max-w-md focus-within:ring-2 focus-within:ring-blue-500">
                    {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>

                    ) : (
                        <Search className="text-slate-400" />
                    )}

                    <input
                        type="text"
                        placeholder="Search by name, email, or action..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full outline-none text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className='h-[1px] w-full bg-gray-200'></div>
                {loading && logs.length == 0 ? (
                    <div className="min-h-[200px] flex flex-col items-center gap-3 justify-center mt-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>

                        <p className="ml-3 text-gray-600">Loading logs...</p>
                    </div>
                ) : logs.length === 0 && !loading ? (
                    <div className="min-h-[200px] flex flex-col items-center justify-center gap-3 text-gray-500">
                        <History className="w-10 h-10 text-gray-400" />
                        <p>No logs found</p>
                    </div>
                ) : (
                    <>
                        {/* logs list */}
                        <div>
                        {logs.map((log) => {
                            const actionType = getActionType(log.action);
                            const uaInfo = parseUserAgent(log.userAgent);

                            return (
                                <div
                                    key={log.id}
                                    onClick={() => setSelectedLog(log)}
                                    className="bg-white cursor-pointer border-b border-slate-200 overflow-hidden hover:bg-gray-50 transition"
                                >
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row items-start gap-4">

                                            {/* Avatar (safe fallback) */}
                                            <div className="w-10 h-10 text-sm rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0  transition-transform duration-200">
                                                {log.admin?.name
                                                    ? log.admin.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                                                    : "?"}
                                            </div>

                                            <div className="flex-1 min-w-0">

                                                {/* Name + Email */}
                                                <div className="flex items-start justify-between gap-4 mb-1">
                                                    <div>
                                                        {log.admin?.name && (
                                                            <h3 className="text-md font-semibold text-slate-800">
                                                                {log.admin.name}
                                                            </h3>
                                                        )}

                                                        {log.admin?.email && (
                                                            <p className="text-xs text-slate-500">{log.admin.email}</p>
                                                        )}
                                                    </div>

                                                    {/* Action Badge */}
                                                    {actionType && (
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getActionColor(actionType)}`}>
                                                            {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Action Text */}
                                                {log.action && (
                                                    <p className="text-slate-700 mb-2 leading-relaxed">{log.action}</p>
                                                )}

                                                {/* Footer Info */}
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">

                                                    {log.createdAt && (
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{formatDate(log.createdAt)}</span>
                                                        </div>
                                                    )}

                                                    {uaInfo?.os && (
                                                        <div className="flex items-center gap-2">
                                                            <MonitorSmartphone className="w-4 h-4" />
                                                            <span>{uaInfo.os}</span>
                                                        </div>
                                                    )}

                                                    {log.admin?.role && (
                                                        <div className="flex items-center gap-2">
                                                            <ShieldCheck className="w-4 h-4" />
                                                            <span className="capitalize">{log.admin.role}</span>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        </div>

                        {/* Load More Button or Loader */}
                        <div className="flex justify-center mt-6">
                            {loadingMore && (
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            )}

                            {!loadingMore && hasMore && (
                                <button
                                    onClick={loadMore}
                                    className="px-6 py-2 bg-gray-200 text-black border rounded-full hover:text-blue-700 transition-all cursor-pointer"
                                >
                                    Load More
                                </button>
                            )}

                            {!loadingMore && !hasMore && logs.length > 0 && (
                                <p className="text-gray-500 text-sm font-medium">No more logs</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ActivityLogs;