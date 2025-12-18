import React, { useState, useEffect, useRef } from 'react';
import lottie from 'lottie-web';

// --- 1. Global Styles ---
const GlobalStyles = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap');
        
        body {
            font-family: 'Noto Sans', sans-serif;
            scroll-behavior: smooth;
            color: #1F2937;
            background-color: #ffffff;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        @keyframes swing {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(5deg); }
            75% { transform: rotate(-5deg); }
        }

        @keyframes gentle-float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
            }
            25% {
                transform: translateY(-8px) rotate(2deg);
            }
            75% {
                transform: translateY(-8px) rotate(-2deg);
            }
        }

        .animate-gentle-float {
            animation: gentle-float 4s ease-in-out infinite;
        }
        
        .mock-scroll::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        .mock-scroll::-webkit-scrollbar-track {
            background: transparent;
        }
        .mock-scroll::-webkit-scrollbar-thumb {
            background: #E5E7EB;
            border-radius: 3px;
        }
        
        .feature-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px -10px rgba(114, 67, 250, 0.1);
        }
        
        .text-gradient {
            background: linear-gradient(135deg, #7243FA 0%, #A78BFA 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .purple-glow-section {
            position: relative;
            overflow: hidden;
        }

        .purple-glow-section::before {
            content: '';
            position: absolute;
            top: -50%;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 200%;
            background: radial-gradient(ellipse at center, rgba(114, 67, 250, 0.08) 0%, rgba(114, 67, 250, 0.03) 40%, transparent 70%);
            pointer-events: none;
            z-index: 0;
        }

        .purple-glow-section > * {
            position: relative;
            z-index: 1;
        }
    `}</style>
);

// --- 2. Icons ---
const Icon = ({ name, size = 20, className = "" }) => {
    const getPath = () => {
        switch(name) {
            case 'menu': return <path d="M4 6h16M4 12h16M4 18h16" />;
            case 'x': return <path d="M18 6L6 18M6 6l12 12" />;
            case 'check': return <polyline points="20 6 9 17 4 12" />;
            case 'arrowRight': return <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>;
            case 'table': return <><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="12" y1="3" x2="12" y2="21" /></>;
            case 'message': return <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
            case 'users': return <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>;
            case 'base': return <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>; 
            case 'board': return <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 2v5" /><path d="M8 2v5" /><path d="M2 11h20" /></>;
            case 'lock': return <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>;
            case 'plus': return <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>;
            case 'filter': return <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />;
            case 'send': return <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>;
            case 'calendar': return <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>;
            case 'kanban': return <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 7v7" /><path d="M16 7v3" /><path d="M8 17v0" /><path d="M16 17v0" /></>;
            case 'smartphone': return <><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>;
            case 'more': return <><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></>;
            case 'search': return <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>;
            case 'bell': return <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>;
            case 'file': return <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />;
            case 'bolt': return <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />;
            case 'database': return <><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></>;
            case 'info': return <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>;
            case 'brain': return <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />;
            case 'bulb': return <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-7 7c0 2 2 3 2 4.5V15a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1.5c0-1.5 2-2.5 2-4.5a7 7 0 0 0-7-7z" /></>;
            default: return <circle cx="12" cy="12" r="10" />;
        }
    };

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {getPath()}
        </svg>
    );
};

// --- 3. UI Wrappers ---
const Button = ({ children, variant = "primary", className = "", onClick, ...props }) => {
    const baseStyle = "inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-bold transition-all duration-300 text-sm md:text-base cursor-pointer select-none";
    const variants = {
        primary: "bg-[#7243FA] text-white hover:bg-[#5E32D9] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0",
        secondary: "bg-white text-[#7243FA] border-2 border-[#7243FA] hover:bg-[#F3F0FF]",
        text: "bg-transparent text-[#6B7280] hover:text-[#7243FA] font-medium"
    };

    return (
        <button 
            className={`${baseStyle} ${variants[variant]} ${className}`} 
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

// --- 4. Mockup Components ---

// 共用 Sidebar
const MockSidebar = ({ activeBase }) => (
    <div className="w-40 flex-shrink-0 flex flex-col bg-gray-50 border-r border-gray-200 h-full text-sm hidden md:flex">
        <div className="p-3 font-bold text-gray-700 flex items-center gap-2 border-b border-gray-200">
            <img src="/logo.png" alt="Mai.today Logo" className="w-6 h-6 object-contain" />
            Mai.today
        </div>
        <div className="flex-1 p-2 space-y-1 overflow-y-auto">
            <div className="text-gray-500 text-xs font-bold px-2 py-1 mt-2">Bases (基地)</div>
            <div className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${activeBase === 'loan' ? 'bg-[#ECE8FF] text-[#7243FA] font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Icon name="base" size={14} /> 貸款顧問部
            </div>
            <div className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${activeBase === 'diving' ? 'bg-[#ECE8FF] text-[#7243FA] font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Icon name="base" size={14} /> 潛水訓練中心
            </div>
            <div className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${activeBase === 'manuf' ? 'bg-[#ECE8FF] text-[#7243FA] font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Icon name="base" size={14} /> 精密設備製造
            </div>
        </div>
    </div>
);

// Mockup 1: 案件管理 (貸款顧問)
const MockCaseManagement = () => {
    const getStatusStyle = (status) => {
        switch(status) {
            case "處理中": return "bg-blue-50 text-blue-600";
            case "已完成": return "bg-green-50 text-green-600";
            case "待審核": return "bg-yellow-50 text-yellow-600";
            case "已暫停": return "bg-red-50 text-red-600";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    return (
        <div className="flex h-full bg-white text-sm">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
                    <div>
                        <h2 className="font-bold text-gray-800 text-lg">專案管理中心</h2>
                        <div className="text-xs text-gray-500">進度追蹤 • 團隊協作 • 即時更新</div>
                    </div>
                    <div className="flex -space-x-2">
                        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">李</div>
                        <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">陳</div>
                    </div>
                </div>

                <div className="h-10 border-b border-gray-200 flex items-center px-4 bg-gray-50 gap-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1 text-[#7243FA] border-b-2 border-[#7243FA] px-1 h-full cursor-pointer">全部案件</div>
                    <div className="flex items-center gap-1 hover:text-gray-700 px-1 h-full cursor-pointer">待補件 (3)</div>
                    <div className="flex items-center gap-1 hover:text-gray-700 px-1 h-full cursor-pointer">本週撥款</div>
                </div>

                <div className="flex-1 overflow-auto mock-scroll bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 sticky top-0 z-10 font-medium text-xs">
                            <tr>
                                <th className="p-3 border-b w-1/4">案件編號</th>
                                <th className="p-3 border-b w-24">狀態</th>
                                <th className="p-3 border-b w-24">專案類型</th>
                                <th className="p-3 border-b w-24">預算(萬)</th>
                                <th className="p-3 border-b w-24">負責人</th>
                                <th className="p-3 border-b w-20 text-center">留言</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs md:text-sm">
                            {[
                                { name: "案件 #2024-001", status: "處理中", type: "專案 A", amount: "120", owner: "李業務", comments: 3, selected: true },
                                { name: "案件 #2024-002", status: "已完成", type: "專案 B", amount: "80", owner: "張業務", comments: 2 },
                                { name: "案件 #2024-003", status: "待審核", type: "專案 C", amount: "65", owner: "李業務", comments: 8 },
                                { name: "案件 #2024-004", status: "已暫停", type: "專案 A", amount: "50", owner: "王業務", comments: 0 },
                                { name: "案件 #2024-005", status: "處理中", type: "專案 D", amount: "85", owner: "李業務", comments: 5 },
                            ].map((row, i) => (
                                <tr key={i} className={`hover:bg-gray-50 group cursor-pointer ${row.selected ? 'bg-blue-50' : ''}`}>
                                    <td className="p-3 font-medium text-gray-800">{row.name}</td>
                                    <td className="p-3"><span className={`text-xs px-2 py-1 rounded ${getStatusStyle(row.status)}`}>{row.status}</span></td>
                                    <td className="p-3 text-gray-600">{row.type}</td>
                                    <td className="p-3 text-gray-800">{row.amount}</td>
                                    <td className="p-3"><div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">{row.owner[0]}</div>{row.owner}</div></td>
                                    <td className="p-3 text-center">
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${row.comments > 0 ? 'bg-[#F3F0FF] text-[#7243FA] hover:bg-[#ECE8FF]' : 'bg-gray-100 text-gray-400'} transition-colors`}>
                                            <Icon name="message" size={14} />
                                            <span className="text-xs font-medium">{row.comments}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right Side Comments Panel */}
            <div className="w-96 border-l border-gray-200 flex flex-col h-full bg-white hidden lg:flex">
                <div className="px-4 py-3 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-bold text-gray-800">案件 #2024-001</div>
                        <button className="text-gray-400 hover:text-gray-600"><Icon name="x" size={16} /></button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon name="message" size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-500">留言 (3)</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs flex-shrink-0">李</div>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-bold text-xs">李業務</span>
                                <span className="text-[10px] text-gray-400">2小時前</span>
                            </div>
                            <div className="text-xs text-gray-700 leading-relaxed">
                                客戶確認需求後，預算可能需要調整到 150 萬
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs flex-shrink-0">張</div>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-bold text-xs">張經理</span>
                                <span className="text-[10px] text-gray-400">1小時前</span>
                            </div>
                            <div className="text-xs text-gray-700 leading-relaxed">
                                <span className="text-[#7243FA] font-medium">@李業務</span> 好的，我會跟主管確認預算調整的部分
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs flex-shrink-0">陳</div>
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-bold text-xs">陳助理</span>
                                <span className="text-[10px] text-gray-400">30分鐘前</span>
                            </div>
                            <div className="text-xs text-gray-700 leading-relaxed">
                                相關文件我已經準備好了，放在附件裡 📎
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-3 border-t border-gray-200 bg-white">
                    <div className="bg-gray-50 rounded px-2 py-1 text-xs text-gray-400 flex items-center">
                        <span>@</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

// Mockup 2: 行事曆 (潛水)
const MockBooking = () => (
    <div className="flex h-full bg-white text-sm">
        <MockSidebar activeBase="diving" />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white">
                <h2 className="font-bold text-gray-800 text-lg">12月 教練排班表</h2>
                <div className="flex gap-2">
                    <button className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded text-xs hover:bg-gray-200 flex items-center gap-1"><Icon name="filter" size={14}/> 教練篩選</button>
                    <button className="bg-[#7243FA] text-white px-3 py-1.5 rounded text-xs hover:bg-[#6039D1]">建立排程</button>
                </div>
            </div>
            <div className="flex-1 flex flex-col p-4 bg-[#FAFAFA] overflow-hidden">
                <div className="grid grid-cols-7 gap-2 mb-2 text-center text-gray-500 text-xs">
                    <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
                </div>
                <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-2 h-full">
                    {[28, 29, 30].map(d => <div key={d} className="bg-white/50 p-1 rounded text-gray-300 text-xs">{d}</div>)}
                    {[...Array(31)].map((_, i) => {
                        const day = i + 1;
                        return (
                            <div key={day} className={`bg-white p-1 rounded border border-gray-200 flex flex-col gap-1 relative ${day === 18 ? 'border-[#7243FA] bg-[#F3F0FF]' : ''}`}>
                                <span className={`text-xs font-bold ${day === 18 ? 'text-[#7243FA]' : 'text-gray-700'}`}>{day}</span>
                                {day === 18 && (
                                    <>
                                        <div className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded truncate border-l-2 border-blue-500">09:00 OW (2)</div>
                                        <div className="text-[9px] bg-green-100 text-green-700 px-1 rounded truncate border-l-2 border-green-500">14:00 Fun (3)</div>
                                    </>
                                )}
                                {(day === 5 || day === 12 || day === 25) && (
                                    <div className="text-[9px] bg-gray-100 text-gray-600 px-1 rounded truncate">店休</div>
                                )}
                                {day === 20 && (
                                     <div className="text-[9px] bg-orange-100 text-orange-700 px-1 rounded truncate border-l-2 border-orange-500">AOW 課程</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
);

// Mockup 3: 團隊聊天室
const MockTeamChat = () => (
    <div className="flex h-full bg-white text-sm">
        <MockSidebar activeBase="loan" />
        <div className="flex-1 flex flex-col h-full relative bg-white">
            <div className="h-14 border-b border-gray-200 flex items-center px-4 bg-white justify-between">
                <div className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-gray-100 p-1.5 rounded"><Icon name="message" size={16}/></span>
                    聊天室
                </div>
                <div className="flex gap-2 text-gray-500">
                    <button className="p-1.5 hover:bg-gray-100 rounded"><Icon name="search" size={16}/></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded"><Icon name="users" size={16}/></button>
                </div>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#FAFAFA]">
                {/* 日期分隔 */}
                <div className="text-center">
                    <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200">12月18日</span>
                </div>

                {/* 訊息氣泡 */}
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs flex-shrink-0">李</div>
                    <div className="max-w-[75%]">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-gray-800 text-xs">李業務</span>
                            <span className="text-[10px] text-gray-400">09:42</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-gray-700 border border-gray-100 text-xs">
                            <span className="text-[#7243FA] font-medium">@張經理</span> 王先生的房貸案件銀行已經核准了，請問接下來要安排對保時間嗎？
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs flex-shrink-0">張</div>
                    <div className="max-w-[75%]">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-gray-800 text-xs">張經理</span>
                            <span className="text-[10px] text-gray-400">09:45</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-gray-700 border border-gray-100 text-xs">
                            太好了！我先聯繫客戶確認時間，確定後會更新到表格裡
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs flex-shrink-0">陳</div>
                    <div className="max-w-[75%]">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-gray-800 text-xs">陳助理</span>
                            <span className="text-[10px] text-gray-400">09:48</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-gray-700 border border-gray-100 text-xs">
                            我已經把相關文件整理好了，需要的話可以直接從 <span className="text-[#7243FA] font-medium">MaiTable</span> 下載 📎
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs flex-shrink-0">我</div>
                    <div className="max-w-[75%] text-right">
                        <div className="bg-[#7243FA] text-white p-3 rounded-2xl rounded-tr-none shadow-md text-xs text-left inline-block">
                            收到！辛苦大家了 👍
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-3 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2.5">
                    <input type="text" placeholder="輸入訊息... 使用 @ 提及成員" className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400" />
                    <button className="text-gray-400 hover:text-gray-600"><Icon name="file" size={18} /></button>
                    <button className="text-[#7243FA]"><Icon name="send" size={18} /></button>
                </div>
            </div>
        </div>
    </div>
);

// Mockup 4: AI 知識庫 (製造業)
const MockKnowledge = () => (
    <div className="flex h-full bg-white text-sm">
        <MockSidebar activeBase="manuf" />
        <div className="flex-1 flex flex-col h-full relative">
            <div className="h-14 border-b border-gray-200 flex items-center px-4 bg-white justify-between">
                <div className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-gray-100 p-1 rounded"><Icon name="message" size={14}/></span>
                    客戶 A - 特規零件詢價
                </div>
                <div className="text-xs text-gray-500">成員: 新人小陳, 資深業務...</div>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#FAFAFA]">
                {/* Question */}
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs flex-shrink-0">陳</div>
                    <div className="max-w-[85%]">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-gray-800">新人小陳</span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-gray-700 border border-gray-100">
                            <span className="text-[#7243FA] font-medium">@AI助理</span> 這家「客戶A」想要報價特規螺絲，他們之前有下過類似的單嗎？有沒有什麼特殊習慣要注意？
                        </div>
                    </div>
                </div>

                {/* AI Answer - Internal Knowledge */}
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs flex-shrink-0">AI</div>
                    <div className="max-w-[85%]">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-gray-800">AI 助理</span>
                            <span className="text-[10px] bg-[#ECE8FF] text-[#7243FA] px-1 rounded">企業知識庫</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-gray-700 border border-gray-100 text-xs md:text-sm">
                            <div className="mb-2 font-bold text-gray-800 flex items-center gap-2">
                                <Icon name="bulb" size={14} className="text-[#7243FA]"/> 知識庫查詢結果：客戶 A
                            </div>
                            <ul className="list-disc pl-4 space-y-2 mb-3 text-gray-600">
                                <li><strong>特殊習慣</strong>：該客戶習慣將尺寸標示為「深 x 寬 x 高」，與業界標準相反，請務必核對圖面！</li>
                                <li><strong>歷史訂單</strong>：
                                    <ul className="list-none pl-0 mt-1 text-xs text-gray-500">
                                        <li>• 2024/05：特規螺絲 M4 (304不鏽鋼) - 成交價 $5.2/顆</li>
                                        <li>• 2023/11：標準螺絲 (鍍鋅) - 成交價 $1.5/顆</li>
                                    </ul>
                                </li>
                                <li><strong>注意事項</strong>：此客戶對防鏽要求極高，建議主動提供鹽霧測試報告。</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Senior Reply */}
                <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs flex-shrink-0">資</div>
                    <div className="max-w-[85%] text-right">
                        <div className="bg-[#7243FA] text-white p-3 rounded-2xl rounded-tr-none shadow-md text-sm text-left inline-block">
                            AI 沒說錯。那個「深寬高」的順序一定要再次確認，上次阿宏就因為這樣做錯一批貨。
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-3 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
                    <input type="text" placeholder="輸入訊息..." className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700" />
                    <button className="text-[#7243FA]"><Icon name="send" size={18} /></button>
                </div>
            </div>
        </div>
    </div>
);

// Mockup: Mobile
const MockMobileCalendar = () => {
    const calendarDays = [
        { day: 27, month: 'prev', events: [] },
        { day: 28, month: 'prev', events: [] },
        { day: 29, month: 'prev', events: [] },
        { day: 30, month: 'prev', events: [] },
        { day: 31, month: 'prev', events: [] },
        { day: 1, month: 'current', events: [] },
        { day: 2, month: 'current', events: [] },
        { day: 3, month: 'current', events: [] },
        { day: 4, month: 'current', events: [] },
        { day: 5, month: 'current', events: ['客戶訪談', '專案會議'] },
        { day: 6, month: 'current', events: ['居琦｜關', 'B/Filter'] },
        { day: 7, month: 'current', events: ['web｜通', 'FCM'] },
        { day: 8, month: 'current', events: ['web｜通'] },
        { day: 9, month: 'current', events: [] },
        { day: 10, month: 'current', events: ['專案管理'] },
        { day: 11, month: 'current', events: [] },
        { day: 12, month: 'current', events: [] },
        { day: 13, month: 'current', events: [] },
        { day: 14, month: 'current', events: [] },
        { day: 15, month: 'current', events: [] },
        { day: 16, month: 'current', events: [] },
        { day: 17, month: 'current', events: [] },
        { day: 18, month: 'current', events: ['專案管理'], highlight: true },
        { day: 19, month: 'current', events: ['留言區'] },
        { day: 20, month: 'current', events: [] },
        { day: 21, month: 'current', events: ['專案管理'] },
        { day: 22, month: 'current', events: [] },
        { day: 23, month: 'current', events: [] },
        { day: 24, month: 'current', events: ['故障/專案管理'] },
        { day: 25, month: 'current', events: ['專案管理'] },
        { day: 26, month: 'current', events: ['專案管理'] },
        { day: 27, month: 'current', events: ['專案管理'] },
        { day: 28, month: 'current', events: ['專案管理'] },
        { day: 29, month: 'current', events: [] },
        { day: 30, month: 'current', events: [] },
    ];

    return (
        <div className="w-full h-full bg-gray-50 flex flex-col relative overflow-hidden text-xs">
            {/* Header */}
            <div className="bg-white px-4 py-3 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-gray-800">2025年12月</span>
                    <span className="text-gray-400">▼</span>
                </div>
                <div className="flex gap-3 text-gray-600">
                    <Icon name="search" size={18} />
                    <Icon name="calendar" size={18} />
                    <Icon name="more" size={18} />
                </div>
            </div>

            {/* Calendar Header */}
            <div className="bg-white px-2 py-2 grid grid-cols-7 text-center text-[10px] text-gray-500 border-b border-gray-200">
                <div>週一</div>
                <div>週二</div>
                <div className="text-[#7243FA]">週三</div>
                <div>週四</div>
                <div>週五</div>
                <div>週六</div>
                <div>週日</div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-y-auto bg-white">
                <div className="grid grid-cols-7 gap-[1px] bg-gray-200">
                    {calendarDays.map((item, idx) => (
                        <div
                            key={idx}
                            className={`bg-white min-h-[65px] p-1 flex flex-col ${item.month === 'prev' ? 'text-gray-300' : ''}`}
                        >
                            <div className={`text-[11px] mb-1 ${item.highlight ? 'text-[#7243FA] font-bold' : 'text-gray-700'}`}>
                                {item.day}
                            </div>
                            <div className="space-y-0.5">
                                {item.events.slice(0, 2).map((event, i) => (
                                    <div
                                        key={i}
                                        className={`text-[8px] px-1 py-0.5 rounded truncate ${
                                            event.includes('web') ? 'bg-green-100 text-green-700' :
                                            event.includes('故障') ? 'bg-red-100 text-red-700' :
                                            'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {event}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="absolute bottom-14 right-3 w-11 h-11 bg-[#6B46E5] rounded-xl flex items-center justify-center text-white shadow-lg">
                <Icon name="plus" size={20} />
            </div>

            {/* Bottom Navigation */}
            <div className="h-12 bg-white border-t border-gray-100 flex justify-around items-center text-gray-400 relative px-2">
                <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-gray-200"></div>
                </div>
                <div className="flex flex-col items-center">
                    <Icon name="message" size={18} />
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                        <Icon name="bulb" size={18} className="text-[#7243FA]" />
                    </div>
                </div>
                <div className="flex flex-col items-center text-[#7243FA]">
                    <Icon name="calendar" size={18} />
                </div>
                <div className="flex flex-col items-center relative">
                    <Icon name="bell" size={18} />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">28</div>
                </div>
            </div>
        </div>
    );
};

// --- 5. Main Components ---

const Navbar = ({ onOpenModal }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: '功能特色', href: '#features' },
        { name: '解決方案', href: '#solutions' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-[1200px] mx-auto px-8 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    <img src="/logo.png" alt="Mai.today Logo" className="w-10 h-10 object-contain" />
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Mai.today</span>
                </div>

                {/* Desktop Nav + CTA */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <a key={link.name} href={link.href} className="text-sm font-medium text-gray-600 hover:text-[#7243FA] transition-colors">
                            {link.name}
                        </a>
                    ))}
                    <Button className="px-6 py-2.5 text-sm shadow-purple-500/20" onClick={onOpenModal}>預約 Demo</Button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-gray-600 p-2" onClick={() => setIsOpen(!isOpen)}>
                    <Icon name={isOpen ? "x" : "menu"} size={24} />
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-4 md:hidden animate-fade-in">
                    {navLinks.map(link => (
                        <a key={link.name} href={link.href} className="block text-base font-medium text-gray-700 hover:text-[#7243FA] p-2 rounded hover:bg-gray-50" onClick={() => setIsOpen(false)}>
                            {link.name}
                        </a>
                    ))}
                    <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
                        <Button className="w-full justify-center py-3" onClick={() => { onOpenModal(); setIsOpen(false); }}>預約 Demo</Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

const InteractiveHeroDemo = () => {
    const [activeTab, setActiveTab] = useState('knowledge'); // Default

    const screens = {
        case: { title: "案件進度管理", desc: "顧問服務：一站式追蹤客戶狀態，文件不再遺漏", component: <MockCaseManagement /> },
        booking: { title: "跨裝置協作", desc: "電腦、手機、平板無縫同步，隨時隨地都能辦公", component: <MockBooking /> },
        knowledge: { title: "企業知識庫", desc: "製造/工程：AI 自動提取歷史經驗，傳承資深智慧", component: <MockKnowledge /> }
    };

    return (
        <div className="relative max-w-[1400px] mx-auto mt-12 px-4">
            <div className="flex justify-center gap-4 mb-8 overflow-x-auto px-4">
                {Object.keys(screens).map((key) => (
                    <button 
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-6 py-2 rounded-full text-sm font-medium border transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${activeTab === key ? 'bg-[#7243FA] text-white border-[#7243FA] shadow-md transform scale-105' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                    >
                        <Icon name={key === 'case' ? 'table' : key === 'booking' ? 'calendar' : 'brain'} size={16} /> 
                        {screens[key].title}
                    </button>
                ))}
            </div>

            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white group">
                <div className="h-9 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                    </div>
                    <div className="ml-4 h-6 bg-white border border-gray-200 rounded flex items-center px-3 text-[10px] text-gray-400 flex-1 justify-center font-mono">
                        <Icon name="lock" size={10} className="mr-1"/> mai.today/app/{activeTab}
                    </div>
                </div>
                <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-100 relative overflow-hidden">
                    {screens[activeTab].component}
                </div>
            </div>
            
            {/* Show Mobile Mockup on Booking tab to emphasize mobile usage */}
            {activeTab === 'booking' && (
                <div className="hidden lg:block absolute -right-10 -bottom-16 w-[240px] h-[480px] rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-gray-800 bg-gray-800 z-30 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500 hover:z-40 animate-fade-in">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-6 bg-gray-800 rounded-b-xl z-50"></div>
                    <MockMobileCalendar />
                </div>
            )}
            
            <div className="text-center mt-6">
                <p className="text-gray-500 text-sm animate-fade-in">{screens[activeTab].desc}</p>
            </div>
        </div>
    );
};

const CorporateBrainSection = () => (
    <section className="py-24 bg-gray-50 px-8 purple-glow-section">
        <div className="max-w-[1400px] mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">如何打造您的企業知識庫？</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">您不需要額外整理文件，只要在 Mai.today 正常工作，AI 就會自動學習。</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
                        <Icon name="message" size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">日常協作</h3>
                    <p className="text-gray-500">
                        團隊在 <span className="text-gray-900 font-medium">Chatroom</span> 討論案件，在 <span className="text-gray-900 font-medium">MaiTable</span> 記錄規格與報價。這些都是最真實的業務數據。
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-purple-50 text-[#7243FA] rounded-full flex items-center justify-center mb-6 shadow-sm border border-purple-100">
                        <Icon name="database" size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AI 讀取資料庫</h3>
                    <p className="text-gray-500">
                        AI 可以直接讀取 <span className="text-gray-900 font-medium">MaiTable</span> 中的所有紀錄與對話內容，將團隊累積的知識轉化為可隨時查詢的<span className="text-gray-900 font-medium">智能資料庫</span>。
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
                        <Icon name="bolt" size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">即時諮詢</h3>
                    <p className="text-gray-500">
                        新人遇到問題不用再等資深前輩有空。直接 <span className="text-gray-900 font-medium">@AI助理</span>，即刻獲得基於公司經驗的專業解答。
                    </p>
                </div>
            </div>
        </div>
    </section>
);

const FeatureItem = ({ title, desc, icon, imageSide = "right", renderMockup, children }) => {
    return (
        <div className={`flex flex-col lg:flex-row items-center gap-16 py-24 ${imageSide === "left" ? "lg:flex-row-reverse" : ""}`}>
            <div className="flex-1 space-y-6 text-left">
                <div className="w-14 h-14 bg-[#ECE8FF] text-[#7243FA] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    {icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{title}</h3>
                <p className="text-lg text-gray-500 leading-relaxed">{desc}</p>
                <div className="pt-4 border-t border-gray-100 mt-6">{children}</div>
            </div>
            
            <div className="flex-1 w-full relative group">
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-xl img-shadow transform transition-transform duration-500 group-hover:scale-[1.01] h-[350px] md:h-[400px]">
                    {renderMockup}
                </div>
            </div>
        </div>
    );
};

const FeaturesSection = () => {
    return (
        <section id="features" className="py-20 bg-white px-8 overflow-hidden purple-glow-section">
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">專為中小企業營運痛點打造</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">整合 Base (基地) 與 Board (協作版)，讓組織內外的協作更加流暢。</p>
                </div>

                <FeatureItem
                    title="MaiTable 智能表格"
                    desc="比試算表更強大，比資料庫更簡單。專為團隊設計，支援多種欄位類型與權限控制，讓專案進度一目了然。"
                    icon={<Icon name="table" size={32} />}
                    imageSide="right"
                    renderMockup={<MockCaseManagement />}
                >
                    <ul className="space-y-4 text-gray-600">
                        <li className="flex items-center gap-3"><div className="text-[#7243FA] bg-[#ECE8FF] p-1 rounded-full"><Icon name="check" size={12} /></div> 支援文字、數字、日期、單選等多種欄位</li>
                        <li className="flex items-center gap-3"><div className="text-[#7243FA] bg-[#ECE8FF] p-1 rounded-full"><Icon name="check" size={12} /></div> 精細的欄位級權限與視圖管理</li>
                        <li className="flex items-center gap-3"><div className="text-[#7243FA] bg-[#ECE8FF] p-1 rounded-full"><Icon name="check" size={12} /></div> 即時多人協作，資料同步零時差</li>
                    </ul>
                </FeatureItem>

                <FeatureItem
                    title="團隊即時溝通"
                    desc="溝通不應該散落在各處。每個專案看板 (Board) 都內建專屬聊天室，討論與工作內容緊密結合，訊息不再遺漏。"
                    icon={<Icon name="message" size={32} />}
                    imageSide="left"
                    renderMockup={<MockTeamChat />}
                >
                    <ul className="space-y-4 text-gray-600">
                        <li className="flex items-center gap-3"><div className="text-[#7243FA] bg-[#ECE8FF] p-1 rounded-full"><Icon name="check" size={12} /></div> 針對專案主題的集中討論區</li>
                        <li className="flex items-center gap-3"><div className="text-[#7243FA] bg-[#ECE8FF] p-1 rounded-full"><Icon name="check" size={12} /></div> 支援檔案分享與圖片傳送</li>
                        <li className="flex items-center gap-3"><div className="text-[#7243FA] bg-[#ECE8FF] p-1 rounded-full"><Icon name="check" size={12} /></div> @提及功能，確保重要訊息被看見</li>
                    </ul>
                </FeatureItem>

                <FeatureItem
                    title="AI 企業知識庫"
                    desc="資深員工的經驗不應該只存在腦海中。Mai.today 自動學習團隊的對話與資料，讓新人也能快速獲得專業解答，縮短養成時間。"
                    icon={<Icon name="brain" size={32} />}
                    imageSide="right"
                    renderMockup={<MockKnowledge />}
                >
                    <ul className="space-y-4 text-gray-600">
                        <li className="flex items-center gap-3"><div className="text-[#7243FA] bg-[#ECE8FF] p-1 rounded-full"><Icon name="check" size={12} /></div> 自動整合歷史訂單、報價與對話紀錄</li>
                        <li className="flex items-center gap-3"><div className="text-[#7243FA] bg-[#ECE8FF] p-1 rounded-full"><Icon name="check" size={12} /></div> @AI助理 即可查詢客戶偏好與注意事項</li>
                        <li className="flex items-center gap-3"><div className="text-[#7243FA] bg-[#ECE8FF] p-1 rounded-full"><Icon name="check" size={12} /></div> 新人秒變專家，降低培訓成本</li>
                    </ul>
                </FeatureItem>
            </div>
        </section>
    );
};

const SolutionCard = ({ title, desc, icon, tags = [] }) => (
    <div className="bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 text-left feature-card group h-full flex flex-col">
        <div className="text-[#7243FA] mb-6 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h4 className="text-xl font-bold mb-3 text-gray-900">{title}</h4>
        <p className="text-gray-500 leading-relaxed mb-6 flex-1">{desc}</p>
        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <span key={tag} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-600">{tag}</span>
            ))}
        </div>
    </div>
);

const SolutionsSection = () => {
    return (
        <section id="solutions" className="py-20 bg-white px-8">
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">專為中小企業營運痛點打造</h2>
                    <p className="text-gray-500">不只是專案管理，而是解決您實際的業務難題</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    <SolutionCard 
                        title="不再漏接客戶需求"
                        desc="針對貸款顧問、房仲等接案產業。將 LINE 的零散對話轉為結構化的案件追蹤。業務、助理、主管在同一平台上協作，清楚掌握每個案件的審核進度。"
                        icon={<Icon name="table" size={40} />}
                        tags={['貸款顧問', '房仲代銷', '接案服務']}
                    />
                    <SolutionCard 
                        title="搞定複雜人員排程"
                        desc="針對潛水店、健身房等預約服務。將混亂的預約訊息自動化為清晰的訂單與教練班表。月底自動結算薪資與營收，告別 Excel 惡夢。"
                        icon={<Icon name="calendar" size={40} />}
                        tags={['潛水旅宿', '課程預約', '活動代訂']}
                    />
                    <SolutionCard 
                        title="傳承資深報價經驗"
                        desc="針對製造業與工程報價。將資深員工的腦中經驗（如客戶特殊規格、工法限制）轉化為 AI 知識庫。新人報價時可即時查詢，減少錯誤與來回確認。"
                        icon={<Icon name="brain" size={40} />}
                        tags={['製造業', '工程報價', '知識管理']}
                    />
                </div>
            </div>
        </section>
    );
};

const HeroSection = ({ onOpenModal }) => {
    const logoAnimationContainer = useRef(null);

    useEffect(() => {
        if (logoAnimationContainer.current) {
            const anim = lottie.loadAnimation({
                container: logoAnimationContainer.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: {
                    "v": "5.7.4",
                    "fr": 30,
                    "ip": 0,
                    "op": 90,
                    "w": 200,
                    "h": 200,
                    "nm": "Logo Float",
                    "ddd": 0,
                    "assets": [],
                    "layers": [{
                        "ddd": 0,
                        "ind": 1,
                        "ty": 2,
                        "nm": "logo.png",
                        "cl": "png",
                        "refId": "image_0",
                        "sr": 1,
                        "ks": {
                            "o": {"a": 0, "k": 100},
                            "r": {"a": 0, "k": 0},
                            "p": {"a": 1, "k": [
                                {"i": {"x": 0.667, "y": 1}, "o": {"x": 0.333, "y": 0}, "t": 0, "s": [100, 100, 0], "to": [0, -2, 0], "ti": [0, 0, 0]},
                                {"i": {"x": 0.667, "y": 1}, "o": {"x": 0.333, "y": 0}, "t": 45, "s": [100, 88, 0], "to": [0, 0, 0], "ti": [0, -2, 0]},
                                {"t": 90, "s": [100, 100, 0]}
                            ]},
                            "a": {"a": 0, "k": [100, 100, 0]},
                            "s": {"a": 0, "k": [100, 100, 100]}
                        },
                        "ao": 0,
                        "ip": 0,
                        "op": 90,
                        "st": 0,
                        "bm": 0
                    }]
                }
            });
            return () => anim.destroy();
        }
    }, []);

    return (
        <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-white text-center px-8 overflow-hidden purple-glow-section">
            <div className="max-w-[1400px] mx-auto animate-fade-in">
                <div className="mb-6 flex justify-center">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4">
                        <img src="/logo.png" alt="Mai.today Logo" className="w-full h-full object-contain animate-gentle-float" />
                    </div>
                </div>
                <div className="mb-6 inline-flex items-center gap-2 bg-[#F3F0FF] text-[#7243FA] px-4 py-2 rounded-full text-sm font-medium">
                    <Icon name="bulb" size={16} />
                    2025 Q2 開放使用 • 搶先預約 Demo
                </div>
                <h1 className="text-4xl md:text-6xl font-bold leading-relaxed md:leading-[1.3] mb-10 text-gray-900 tracking-tight">
                    讓企業協作跟聊天一樣<span className="text-gradient">簡單</span>
                </h1>
                <p className="text-xl text-gray-500 mb-16 max-w-3xl mx-auto leading-loose">
                    整合專案管理、數據協作與 AI 助理的智能平台
                    <br className="hidden md:block" />
                    專為中小企業打造，讓團隊專注在真正重要的事
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                    <Button className="text-lg px-8 py-4 shadow-lg shadow-purple-500/30" onClick={onOpenModal}>
                        預約 Demo
                    </Button>
                    <Button variant="secondary" className="text-lg px-8 py-4" onClick={() => document.getElementById('features').scrollIntoView({behavior: 'smooth'})}>
                        了解更多
                    </Button>
                </div>
                <InteractiveHeroDemo />
            </div>
        </section>
    );
};

// Modal 組件
const BookingModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            {/* 背景遮罩 */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

            {/* Modal 內容 */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* 關閉按鈕 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                    <Icon name="x" size={24} />
                </button>

                {/* 表單內容 */}
                <div className="p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#F3F0FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Icon name="calendar" size={32} className="text-[#7243FA]" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">預約 Demo 演示</h3>
                        <p className="text-gray-500">填寫資訊，我們將在 2 個工作天內與您聯繫</p>
                    </div>

                    <form
                        action="https://formsubmit.co/one@mai.today"
                        method="POST"
                        className="space-y-5"
                    >
                        {/* FormSubmit 隱藏設定 */}
                        <input type="hidden" name="_cc" value="cindy@mai.today" />
                        <input type="hidden" name="_subject" value="Mai.today 官網預約 Demo" />
                        <input type="hidden" name="_template" value="table" />

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">如何稱呼 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="如何稱呼"
                                placeholder="請輸入您的稱呼"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7243FA] focus:border-transparent outline-none transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">聯絡資訊 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="聯絡資訊"
                                placeholder="Email 或 Line ID"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7243FA] focus:border-transparent outline-none transition-all"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">請提供 Email 或 Line ID，方便我們與您聯繫</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">您的行業類型</label>
                            <select
                                name="行業類型"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7243FA] focus:border-transparent outline-none transition-all bg-white"
                            >
                                <option value="">請選擇</option>
                                <option value="製造業">製造業</option>
                                <option value="貿易/零售">貿易/零售</option>
                                <option value="金融/保險">金融/保險</option>
                                <option value="顧問/服務業">顧問/服務業</option>
                                <option value="科技/軟體">科技/軟體</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">問題描述</label>
                            <textarea
                                name="問題描述"
                                rows="4"
                                placeholder="請簡單描述您遇到的問題或需求..."
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#7243FA] focus:border-transparent outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center px-6 py-4 rounded-lg font-bold transition-all duration-300 text-base cursor-pointer select-none bg-[#7243FA] text-white hover:bg-[#5E32D9] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            送出預約申請
                        </button>

                        <p className="text-xs text-gray-400 text-center">
                            我們將在 2 個工作天內與您聯繫，為您安排專人 Demo
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

const Footer = ({ onOpenModal }) => {
    return (
        <footer className="bg-gray-50 pt-24 pb-12 px-8 border-t border-gray-200 purple-glow-section">
            <div className="max-w-[1400px] mx-auto text-center" id="contact">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">準備好提升團隊協作效率了嗎？</h2>
                <p className="text-gray-500 mb-8 text-lg">Mai.today 協助您建立企業專屬的智能協作平台</p>

                <Button className="text-lg px-8 py-4 shadow-lg shadow-purple-500/30" onClick={onOpenModal}>
                    立即預約 Demo
                </Button>

                <div className="mt-24 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Mai.today Logo" className="w-6 h-6 object-contain" />
                        <span className="font-bold text-gray-600">Mai.today</span>
                    </div>
                    <div>© 2025 RollBytes Inc. All rights reserved.</div>
                </div>
            </div>
        </footer>
    );
};

const App = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#ECE8FF] selection:text-[#7243FA]">
            <GlobalStyles />
            <Navbar onOpenModal={() => setIsModalOpen(true)} />
            <HeroSection onOpenModal={() => setIsModalOpen(true)} />
            <CorporateBrainSection />
            <FeaturesSection />
            <SolutionsSection />
            <Footer onOpenModal={() => setIsModalOpen(true)} />
            <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default App;