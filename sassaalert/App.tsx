import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MockPhone from './components/MockPhone';
import { GrantType, MockSms, PaydayDate } from './types';
import { saveUser, getUserCount } from './services/mockDatabase';
import { getNextPayDates } from './constants';
import { generatePersonalizedSms, getFinancialTip } from './services/geminiService';
import { Shield, Calendar, BellRing, CheckCircle2, User, Phone, Wallet, AlertCircle, TrendingUp, HeartHandshake, MessageCircle } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [formData, setFormData] = useState({ name: '', phone: '', grantType: GrantType.OLD_AGE });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mockMessages, setMockMessages] = useState<MockSms[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [payDates, setPayDates] = useState<PaydayDate[]>([]);
  const [aiTip, setAiTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(false);

  useEffect(() => {
    setSubscriberCount(getUserCount());
    setPayDates(getNextPayDates());
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Save to mock DB
      await saveUser(formData.name, formData.phone, formData.grantType);
      setSubscriberCount(prev => prev + 1);

      // 2. Generate personalized welcome SMS via Gemini
      const smsText = await generatePersonalizedSms(formData.name, formData.grantType);
      
      const newSms: MockSms = {
        id: Date.now().toString(),
        sender: 'SassaAlert',
        message: smsText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMockMessages(prev => [...prev, newSms]);
      setSuccess(true);
      
      // 3. Get a financial tip for the "Thank you" screen
      setLoadingTip(true);
      const tip = await getFinancialTip(formData.grantType);
      setAiTip(tip);
      setLoadingTip(false);

    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrantSelect = (type: GrantType) => {
    setFormData({ ...formData, grantType: type });
  };

  const renderHome = () => (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-4">
                  Trusted by {subscriberCount.toLocaleString()} South Africans
                </span>
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Don't wait in line.</span>{' '}
                  <span className="block text-orange-600 xl:inline">Know your payday.</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Get free SMS notifications for SASSA pay dates directly to your phone. We help you plan better and avoid unnecessary trips to the ATM.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => setCurrentPage('subscribe')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg transition-all shadow-orange-200 shadow-lg"
                    >
                      Start Free Alerts
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => setCurrentPage('dates')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 md:py-4 md:text-lg"
                    >
                      View Calendar
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-orange-50 flex items-center justify-center p-8">
            <div className="w-full max-w-sm">
                <MockPhone messages={[
                    { id: '1', sender: 'SassaAlert', message: 'SASSA Alert: Your Old Age Grant will be paid on 02 November. Stay safe! 🧡', timestamp: '08:00' },
                    { id: '2', sender: 'SassaAlert', message: 'Tip: Check your balance via USSD *120*3210# to save ATM fees.', timestamp: '08:05' }
                ]} />
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Why Join?</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple, Safe, and Reliable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Accurate Dates</h3>
            <p className="text-gray-500">We track official SASSA announcements to ensure you get the correct payment dates every month.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Scam Alerts</h3>
            <p className="text-gray-500">Receive warnings about known scams targeting grant beneficiaries in your area.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
              <Wallet size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Budgeting</h3>
            <p className="text-gray-500">Get free monthly tips on how to make your grant money go further, powered by AI.</p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderSubscribe = () => (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border-t-4 border-orange-500">
        <div>
           <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
             <BellRing className="h-8 w-8 text-orange-600" />
           </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign up for Alerts
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the community of {subscriberCount.toLocaleString()} happy subscribers.
          </p>
        </div>

        {success ? (
          <div className="text-center animate-fade-in space-y-6">
             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Success!</h3>
                <p className="mt-2 text-sm text-gray-500">
                  You will receive SMS notifications at <strong>{formData.phone}</strong>.
                </p>
              </div>

              {/* AI Generated Tip Card */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100 text-left">
                  <div className="flex items-center gap-2 mb-2 text-orange-700 font-bold text-xs uppercase tracking-wider">
                    <TrendingUp size={14} />
                    <span>Your First Tip</span>
                  </div>
                  {loadingTip ? (
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-2 bg-orange-200 rounded"></div>
                        <div className="h-2 bg-orange-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ) : (
                     <p className="text-sm text-gray-800 italic">"{aiTip}"</p>
                  )}
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-2 font-semibold">PREVIEW OF SMS SENT:</p>
                {mockMessages.slice(-1).map(m => (
                    <div key={m.id} className="bg-white p-3 rounded shadow-sm text-left border-l-4 border-orange-500">
                        <p className="text-sm text-gray-800">{m.message}</p>
                    </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setSuccess(false);
                  setFormData({ ...formData, name: '', phone: '' });
                  setMockMessages([]);
                }}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
              >
                Register Another Person
              </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubscribe}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="e.g. Thabo Mbeki"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    pattern="^0[0-9]{9}$"
                    title="Please enter a valid 10-digit SA phone number starting with 0"
                    className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="e.g. 082 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">We never share your number.</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Grant Type</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.values(GrantType).map((type) => (
                    <div
                      key={type}
                      onClick={() => handleGrantSelect(type)}
                      className={`cursor-pointer border rounded-lg p-3 flex items-center justify-between transition-all ${
                        formData.grantType === type
                          ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <span className={`text-sm font-medium ${formData.grantType === type ? 'text-orange-900' : 'text-gray-700'}`}>
                        {type}
                      </span>
                      {formData.grantType === type && <CheckCircle2 className="h-5 w-5 text-orange-600" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                  isLoading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  'Subscribe for Free'
                )}
              </button>
            </div>
            
            <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
               <Shield size={16} className="shrink-0 mt-0.5" />
               <p>This is a community service. We are not SASSA but we help you stay informed about official dates.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  const renderDates = () => (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-gray-900">Upcoming Pay Dates</h2>
        <p className="mt-2 text-gray-600">Based on standard SASSA payment schedules.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {payDates.map((item, idx) => (
          <div key={idx} className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-orange-500">
            <div className="px-4 py-5 sm:p-6 flex justify-between items-center">
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate mb-1">
                  {item.grantType}
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {item.date}
                </dd>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                <Calendar size={24} />
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.estimated ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                   {item.estimated ? 'Estimated' : 'Confirmed'}
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
         <AlertCircle className="text-blue-600 shrink-0" />
         <div>
            <h4 className="font-bold text-blue-900 text-sm">Important Note</h4>
            <p className="text-sm text-blue-800 mt-1">If the payment date falls on a weekend or public holiday, payment will be made on the following working day.</p>
         </div>
      </div>
    </div>
  );

  const renderAIHelp = () => (
    <div className="max-w-3xl mx-auto py-12 px-4">
       <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-white">
             <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                    <HeartHandshake size={28} />
                </div>
                <h2 className="text-2xl font-bold">Ask SASSA Helper</h2>
             </div>
             <p className="opacity-90">Powered by advanced AI to help you manage your finances.</p>
          </div>
          
          <div className="p-6">
              <p className="text-gray-600 mb-6">Select a topic to get instant advice generated by our AI system.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { label: 'Saving on Groceries', type: GrantType.CHILD_SUPPORT },
                   { label: 'Safe Banking Tips', type: GrantType.OLD_AGE },
                   { label: 'SRD Application Info', type: GrantType.SRD },
                   { label: 'Budgeting for School', type: GrantType.FOSTER_CHILD }
                 ].map((topic, i) => (
                    <button 
                        key={i}
                        onClick={async () => {
                            setAiTip("Thinking...");
                            setLoadingTip(true);
                            // Scroll to result
                            const resultEl = document.getElementById('ai-result');
                            resultEl?.scrollIntoView({ behavior: 'smooth' });
                            
                            const advice = await getFinancialTip(topic.type);
                            setAiTip(advice);
                            setLoadingTip(false);
                        }}
                        className="text-left p-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group"
                    >
                        <span className="font-bold text-gray-800 group-hover:text-orange-700">{topic.label}</span>
                        <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                            <span>Tap to ask</span>
                            <TrendingUp size={12} />
                        </div>
                    </button>
                 ))}
              </div>

              <div id="ai-result" className="mt-8">
                <div className="bg-slate-50 rounded-xl p-6 min-h-[120px] border border-slate-200 relative">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                         <MessageCircle size={64} />
                    </div>
                   <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">AI Response</h3>
                   {loadingTip ? (
                       <div className="flex space-x-2 animate-pulse">
                           <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                           <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-75"></div>
                           <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-150"></div>
                       </div>
                   ) : (
                       <p className={`text-lg leading-relaxed ${aiTip ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                           {aiTip || "Select a topic above to see advice here..."}
                       </p>
                   )}
                </div>
              </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      <main>
        {currentPage === 'home' && renderHome()}
        {currentPage === 'subscribe' && renderSubscribe()}
        {currentPage === 'dates' && renderDates()}
        {currentPage === 'ai-help' && renderAIHelp()}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} SassaAlert. Not affiliated with the South African Social Security Agency.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;