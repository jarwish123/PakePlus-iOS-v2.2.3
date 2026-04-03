window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>孕妈关怀记录册</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useRef, useEffect } = React;

    // 封装 Lucide 图标组件 (因为在浏览器环境中直接使用 npm 包不太方便，我们使用现成的 SVG 结构或者模拟)
    const Icon = ({ name, className = "w-6 h-6", ...props }) => {
      // 简单映射一些常用图标，实际项目中最好引入完整 SVG 或字体图标
      const svgPaths = {
        Baby: <path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
        Heart: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={props.fill || "none"}/>,
        List: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
        PlusCircle: <path d="M12 8v4m0 0v4m0-4h4m-4 0H8m4-9a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
        Activity: <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
        CalendarHeart: <path d="M3 10h18M16 14l-4 4-4-4M12 18v-8M8 2v4M16 2v4M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>, // 近似替代
        Droplets: <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7 6.3 7 6.3s-2.29 2.76-2.29 2.76C3.57 10 3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05ZM17 16.3c1.7 0 3-1.4 3-3.1 0-.89-.44-1.73-1.31-2.45S17 8.6 17 8.6s-1.75 2.15-1.75 2.15C14.44 11.47 14 12.31 14 13.2c0 1.7 1.3 3.1 3 3.1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
        Camera: <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3ZM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
        Trash2: <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
        ImageIcon: <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM3 16l5-5c.8-.8 2.2-.8 3 0l6 6M14 10l1-1c.8-.8 2.2-.8 3 0l3 3M10 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
        Sparkles: <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>,
        Loader2: <path d="M21 12a9 9 0 1 1-6.219-8.56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> // 简化版
      };

      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} {...props}>
          {svgPaths[name]}
        </svg>
      );
    };

    // Gemini API 辅助函数
    const generateAIContent = async (prompt) => {
      const apiKey = "";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

      let retries = 5;
      let delay = 1000;
      
      while (retries > 0) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              systemInstruction: {
                parts: [{ text: "你是一个温柔、贴心、充满同理心的孕期关怀助手。你的任务是给孕妈妈提供情感支持、鼓励和基础的健康生活建议。语言要像闺蜜或温和的护士一样，避免冷冰冰的机器感。字数尽量控制在50-80字左右。注意：你不能代替专业的医疗诊断。" }]
              }
            })
          });
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "抱歉，我现在有点累了，请稍后再试。";
        } catch (error) {
          retries--;
          if (retries === 0) return "抱歉，暂时无法连接到 AI 助手，请稍后再试。";
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
        }
      }
    };

    const App = () => {
      const [activeTab, setActiveTab] = useState('add');
      
      // 尝试从 localStorage 读取数据
      const getInitialEntries = () => {
        const saved = localStorage.getItem('maternityEntries');
        if (saved) {
          return JSON.parse(saved);
        }
        return [
          {
            id: '1',
            date: '2026-04-01',
            weight: 64.2,
            water: 1800,
            notes: '今天宝宝踢了我好几次，感觉非常神奇！',
            photoUrl: null
          },
          {
            id: '2',
            date: '2026-04-02',
            weight: 64.5,
            water: 2000,
            notes: '按时喝水，去医院做了常规产检，医生说一切都很健康。',
            photoUrl: null
          }
        ];
      };

      const [entries, setEntries] = useState(getInitialEntries);

      // 保存到 localStorage
      useEffect(() => {
        localStorage.setItem('maternityEntries', JSON.stringify(entries));
      }, [entries]);

      const addEntry = (newEntry) => {
        const updatedEntries = [newEntry, ...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
        setEntries(updatedEntries);
        setActiveTab('history');
      };

      const updateEntry = (id, updatedFields) => {
        setEntries(entries.map(entry => 
          entry.id === id ? { ...entry, ...updatedFields } : entry
        ));
      };

      const deleteEntry = (id) => {
        setEntries(entries.filter(entry => entry.id !== id));
      };

      return (
        <div className="min-h-screen bg-pink-50 flex justify-center font-sans">
          <div className="w-full max-w-md bg-white shadow-xl flex flex-col relative min-h-screen">
            
            <header className="bg-gradient-to-r from-pink-300 to-rose-300 text-white p-6 rounded-b-3xl shadow-sm z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Icon name="Baby" className="w-8 h-8" />
                    孕期美好时光
                  </h1>
                  <p className="text-pink-50 mt-1 text-sm opacity-90">记录您与宝宝的每一天</p>
                </div>
                <Icon name="Heart" className="w-8 h-8 text-white opacity-80" fill="currentColor" />
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 pb-24 bg-pink-50/30">
              {activeTab === 'add' && <AddEntryForm onAdd={addEntry} />}
              {activeTab === 'history' && <HistoryLog entries={entries} onDelete={deleteEntry} onUpdate={updateEntry} />}
              {activeTab === 'stats' && <StatsView entries={entries} />}
            </main>

            <nav className="absolute bottom-0 w-full bg-white border-t border-pink-100 flex justify-around p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] rounded-t-2xl z-20">
              <button 
                onClick={() => setActiveTab('history')}
                className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'history' ? 'text-pink-500' : 'text-gray-400'}`}
              >
                <Icon name="List" className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">记录日记</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('add')}
                className="relative -top-6 bg-gradient-to-tr from-pink-400 to-rose-400 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Icon name="PlusCircle" className="w-8 h-8" />
              </button>
              
              <button 
                onClick={() => setActiveTab('stats')}
                className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'stats' ? 'text-pink-500' : 'text-gray-400'}`}
              >
                <Icon name="Activity" className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">数据统计</span>
              </button>
            </nav>
          </div>
        </div>
      );
    };

    const AddEntryForm = ({ onAdd }) => {
      const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
      const [weight, setWeight] = useState('');
      const [water, setWater] = useState('');
      const [notes, setNotes] = useState('');
      const [photo, setPhoto] = useState(null);
      const fileInputRef = useRef(null);

      const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPhoto(reader.result); // 使用 base64 方便本地存储
          };
          reader.readAsDataURL(file);
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!date) return;

        const newEntry = {
          id: Date.now().toString(),
          date,
          weight: parseFloat(weight) || 0,
          water: parseInt(water) || 0,
          notes,
          photoUrl: photo
        };
        
        onAdd(newEntry);
        
        setWeight('');
        setWater('');
        setNotes('');
        setPhoto(null);
      };

      const handleAddWater = (amount) => {
        const currentWater = parseInt(water) || 0;
        setWater((currentWater + amount).toString());
      };

      return (
        <div className="animate-fade-in-up">
          <h2 className="text-lg font-bold text-gray-700 mb-4 px-1">添加新记录</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-50">
              <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                <Icon name="CalendarHeart" className="w-4 h-4 mr-2 text-pink-400" />
                记录日期
              </label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition-shadow"
                required
              />
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-50">
              <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                <Icon name="Activity" className="w-4 h-4 mr-2 text-blue-400" />
                体重 (kg)
              </label>
              <input 
                type="number" 
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="例如: 65.5"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-shadow"
              />
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-cyan-100 relative overflow-hidden">
              <div className="flex justify-between items-end mb-3">
                <label className="flex items-center text-sm font-semibold text-gray-600">
                  <Icon name="Droplets" className="w-4 h-4 mr-2 text-cyan-400" />
                  今日饮水 (ml)
                </label>
                <span className="text-cyan-600 font-bold text-sm">
                  {water || 0} <span className="text-gray-400 font-normal text-xs">/ 2000 ml</span>
                </span>
              </div>

              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                <button type="button" onClick={() => handleAddWater(100)} className="shrink-0 px-4 py-1.5 bg-cyan-50 text-cyan-600 hover:bg-cyan-100 rounded-full text-xs font-semibold transition-colors shadow-sm">+ 100</button>
                <button type="button" onClick={() => handleAddWater(200)} className="shrink-0 px-4 py-1.5 bg-cyan-50 text-cyan-600 hover:bg-cyan-100 rounded-full text-xs font-semibold transition-colors shadow-sm">+ 200</button>
                <button type="button" onClick={() => handleAddWater(300)} className="shrink-0 px-4 py-1.5 bg-cyan-50 text-cyan-600 hover:bg-cyan-100 rounded-full text-xs font-semibold transition-colors shadow-sm">+ 300</button>
                <button type="button" onClick={() => handleAddWater(500)} className="shrink-0 px-4 py-1.5 bg-cyan-50 text-cyan-600 hover:bg-cyan-100 rounded-full text-xs font-semibold transition-colors shadow-sm">+ 500</button>
              </div>

              <input 
                type="number" 
                step="50"
                value={water}
                onChange={(e) => setWater(e.target.value)}
                placeholder="也可在此手动输入总饮水量..."
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 transition-shadow text-sm"
              />

              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-300 to-blue-400 h-full transition-all duration-500 ease-out" 
                  style={{ width: `${Math.min(((parseInt(water) || 0) / 2000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-50">
              <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                <Icon name="Camera" className="w-4 h-4 mr-2 text-purple-400" />
                今日照片 (孕肚/B超单/生活照)
              </label>
              
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handlePhotoUpload}
              />
              
              {photo ? (
                <div className="relative mt-2 rounded-xl overflow-hidden shadow-sm group">
                  <img src={photo} alt="今日照片" className="w-full h-48 object-cover" />
                  <button 
                    type="button"
                    onClick={() => setPhoto(null)}
                    className="absolute top-2 right-2 bg-red-500/80 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Icon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full mt-2 border-2 border-dashed border-pink-200 bg-pink-50/50 hover:bg-pink-50 text-pink-400 p-6 rounded-xl flex flex-col items-center justify-center transition-colors"
                >
                  <Icon name="ImageIcon" className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-sm font-medium">点击上传照片</span>
                </button>
              )}
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-50">
              <label className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                <Icon name="Heart" className="w-4 h-4 mr-2 text-rose-400" />
                孕期日记 / 感受
              </label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="今天宝宝动了吗？心情如何？"
                rows="3"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 transition-shadow resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold py-4 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95 mt-4"
            >
              保存今日记录
            </button>
          </form>
        </div>
      );
    };

    const HistoryLog = ({ entries, onDelete, onUpdate }) => {
      const [loadingId, setLoadingId] = useState(null);

      const handleGetAIResponse = async (entry) => {
        if (!entry.notes) return;
        setLoadingId(entry.id);
        const prompt = `请阅读这位孕妈妈今天的日记："${entry.notes}"。请用一段温暖、鼓励的话语回复她，给予情感支持。`;
        const aiResponse = await generateAIContent(prompt);
        onUpdate(entry.id, { aiResponse });
        setLoadingId(null);
      };

      if (entries.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-center">
            <Icon name="List" className="w-16 h-16 mb-4 opacity-20" />
            <p>还没有任何记录哦~</p>
            <p className="text-sm mt-1">点击下方的 "+" 按钮开始记录吧</p>
          </div>
        );
      }

      return (
        <div className="space-y-4 animate-fade-in-up">
          <h2 className="text-lg font-bold text-gray-700 mb-4 px-1">历史日记</h2>
          {entries.map(entry => (
            <div key={entry.id} className="bg-white rounded-2xl p-4 shadow-sm border border-pink-50 relative group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="bg-pink-100 text-pink-600 font-bold p-2 rounded-xl text-center min-w-[3.5rem]">
                    <div className="text-xs uppercase">{new Date(entry.date).toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-lg leading-tight">{new Date(entry.date).getDate()}</div>
                  </div>
                </div>
                
                <button 
                  onClick={() => onDelete(entry.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-1"
                  title="删除记录"
                >
                  <Icon name="Trash2" className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-4 mb-3 px-1">
                {entry.weight > 0 && (
                  <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                    <Icon name="Activity" className="w-3 h-3 mr-1 text-blue-500" />
                    {entry.weight} kg
                  </div>
                )}
                {entry.water > 0 && (
                  <div className="flex items-center text-sm text-gray-600 bg-cyan-50 px-3 py-1 rounded-full">
                    <Icon name="Droplets" className="w-3 h-3 mr-1 text-cyan-500" />
                    {entry.water} ml
                  </div>
                )}
              </div>

              {entry.notes && (
                <p className="text-gray-600 text-sm leading-relaxed px-1 mb-3">
                  {entry.notes}
                </p>
              )}

              {entry.notes && !entry.aiResponse && loadingId !== entry.id && (
                <button 
                  onClick={() => handleGetAIResponse(entry)}
                  className="mb-3 px-3 py-1.5 bg-fuchsia-50 text-fuchsia-600 rounded-lg text-xs font-medium flex items-center hover:bg-fuchsia-100 transition-colors"
                >
                  <Icon name="Sparkles" className="w-3 h-3 mr-1" />
                  ✨ 获取 AI 贴心回应
                </button>
              )}

              {loadingId === entry.id && (
                <div className="mb-3 px-3 py-2 bg-fuchsia-50 rounded-lg text-xs text-fuchsia-500 flex items-center">
                  <Icon name="Loader2" className="w-3 h-3 mr-2 animate-spin" />
                  AI 正在仔细阅读您的日记...
                </div>
              )}

              {entry.aiResponse && (
                <div className="mb-3 p-3 bg-gradient-to-r from-fuchsia-50 to-pink-50 border border-fuchsia-100 rounded-xl relative">
                  <div className="absolute -top-2 -left-2 bg-white rounded-full p-1 shadow-sm">
                    <Icon name="Sparkles" className="w-4 h-4 text-fuchsia-500" />
                  </div>
                  <p className="text-fuchsia-800 text-xs leading-relaxed ml-2">
                    <span className="font-bold block mb-1">AI 孕期助手：</span>
                    {entry.aiResponse}
                  </p>
                </div>
              )}

              {entry.photoUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-gray-100">
                  <img src={entry.photoUrl} alt="记录照片" className="w-full h-auto max-h-48 object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>
      );
    };

    const StatsView = ({ entries }) => {
      const [aiAdvice, setAiAdvice] = useState(null);
      const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);

      const validWeightEntries = entries.filter(e => e.weight > 0).sort((a, b) => new Date(a.date) - new Date(b.date));
      
      const latestWeight = validWeightEntries.length > 0 ? validWeightEntries[validWeightEntries.length - 1].weight : 0;
      const initialWeight = validWeightEntries.length > 0 ? validWeightEntries[0].weight : 0;
      const weightChange = (latestWeight - initialWeight).toFixed(1);

      const avgWater = entries.length > 0 
        ? Math.round(entries.reduce((acc, curr) => acc + curr.water, 0) / entries.length)
        : 0;

      const handleGenerateAdvice = async () => {
        setIsGeneratingAdvice(true);
        const prompt = `根据孕妈妈的近期数据生成简短的鼓励和健康建议。数据：最近体重 ${latestWeight || '未知'}kg，平均每日饮水 ${avgWater}ml。`;
        const advice = await generateAIContent(prompt);
        setAiAdvice(advice);
        setIsGeneratingAdvice(false);
      };

      return (
        <div className="animate-fade-in-up space-y-6">
          <h2 className="text-lg font-bold text-gray-700 mb-4 px-1">孕期数据概览</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl shadow-sm border border-blue-100 flex flex-col items-center justify-center text-center">
              <Icon name="Activity" className="w-8 h-8 text-blue-400 mb-2" />
              <p className="text-xs text-blue-600/80 font-semibold mb-1">总体重变化</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-blue-700">
                  {weightChange > 0 ? '+' : ''}{weightChange}
                </span>
                <span className="text-sm text-blue-600">kg</span>
              </div>
              <p className="text-[10px] text-blue-500 mt-2">最新体重: {latestWeight || '--'} kg</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-5 rounded-2xl shadow-sm border border-cyan-100 flex flex-col items-center justify-center text-center">
              <Icon name="Droplets" className="w-8 h-8 text-cyan-400 mb-2" />
              <p className="text-xs text-cyan-600/80 font-semibold mb-1">平均每日饮水</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-cyan-700">{avgWater}</span>
                <span className="text-sm text-cyan-600">ml</span>
              </div>
              <p className="text-[10px] text-cyan-500 mt-2">建议每日 2000ml</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-purple-100 mt-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Icon name="Sparkles" className="w-16 h-16 text-purple-500" />
            </div>
            <h3 className="font-bold text-purple-700 mb-2 flex items-center">
              <Icon name="Sparkles" className="w-5 h-5 mr-2" />
              AI 专属孕期建议
            </h3>
            
            {!aiAdvice && !isGeneratingAdvice && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-3">基于您的体重和饮水数据，AI助手可以为您提供专属的健康小贴士哦！</p>
                <button 
                  onClick={handleGenerateAdvice}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-600 text-sm font-bold py-2 px-4 rounded-xl transition-colors shadow-sm inline-flex items-center"
                >
                  <Icon name="Sparkles" className="w-4 h-4 mr-1" />
                  生成我的专属建议
                </button>
              </div>
            )}

            {isGeneratingAdvice && (
              <div className="flex flex-col items-center justify-center py-6 text-purple-400">
                <Icon name="Loader2" className="w-6 h-6 animate-spin mb-2" />
                <span className="text-xs">AI 正在分析您的健康数据...</span>
              </div>
            )}

            {aiAdvice && !isGeneratingAdvice && (
              <div>
                <p className="text-sm text-purple-800 leading-relaxed bg-purple-50 p-3 rounded-xl border border-purple-100">
                  {aiAdvice}
                </p>
                <div className="text-right mt-2">
                  <button 
                    onClick={handleGenerateAdvice}
                    className="text-xs text-purple-400 hover:text-purple-600 transition-colors inline-flex items-center"
                  >
                    <Icon name="Sparkles" className="w-3 h-3 mr-1" />
                    重新生成
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-pink-100 text-center mt-6">
            <Icon name="Heart" className="w-10 h-10 text-pink-300 mx-auto mb-3" fill="currentColor" opacity="0.5" />
            <h3 className="font-bold text-gray-700 mb-2">孕妈妈，您辛苦了！</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              保持好心情，注意营养均衡。每一次记录，都是宝宝成长的见证。
            </p>
          </div>
        </div>
      );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>
