import { useState } from "react";
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  Book, 
  Video,
  ChevronRight,
  Search,
  Send,
  MessageCircle
} from "lucide-react";

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, type: "bot", text: "Hello! How can I help you today?" }
  ]);

  const faqCategories = [
    {
      title: "Getting Started",
      icon: Book,
      faqs: [
        { q: "How do I reset my password?", a: "Go to Settings > Security > Change Password. Enter your current password and then your new password." },
        { q: "How do I update my profile?", a: "Click on your profile picture in the top right corner and select 'My Profile' to edit your information." },
        { q: "How do I navigate the dashboard?", a: "Use the sidebar on the left to access different sections. The dashboard provides an overview of your activities." }
      ]
    },
    {
      title: "Account & Billing",
      icon: MessageSquare,
      faqs: [
        { q: "How do I upgrade my subscription?", a: "Go to Settings > Subscription to view available plans and upgrade your account." },
        { q: "Where can I find my invoices?", a: "Invoices are available in Settings > Billing > Invoice History." },
        { q: "How do I cancel my subscription?", a: "Contact your school administrator or reach out to our support team for subscription changes." }
      ]
    },
    {
      title: "Technical Support",
      icon: HelpCircle,
      faqs: [
        { q: "Why is the page not loading?", a: "Try clearing your browser cache and cookies, then refresh the page. If the issue persists, check your internet connection." },
        { q: "How do I report a bug?", a: "Use the 'Report an Issue' button below or contact support with details about the problem." },
        { q: "What browsers are supported?", a: "We support the latest versions of Chrome, Firefox, Safari, and Edge browsers." }
      ]
    }
  ];

  const supportOptions = [
    { 
      title: "Live Chat", 
      desc: "Chat with our support team", 
      icon: MessageSquare,
      action: () => setShowChat(true)
    },
    { 
      title: "Email Support", 
      desc: "support@schoolpilot.com", 
      icon: Mail,
      action: () => window.location.href = "mailto:support@schoolpilot.com"
    },
    { 
      title: "Phone Support", 
      desc: "+1 (555) 123-4567", 
      icon: Phone,
      action: () => {}
    },
    { 
      title: "Documentation", 
      desc: "Browse our guides", 
      icon: FileText,
      action: () => {}
    }
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const userMessage = { id: Date.now(), type: "user", text: chatMessage };
    setMessages([...messages, userMessage]);
    setChatMessage("");
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: "bot", 
        text: "Thank you for your message! Our support team will get back to you shortly. In the meantime, you can check our FAQ section for quick answers." 
      }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Search Section */}
        <div className="bg-blue-600 rounded-2xl p-8 mb-6 text-white shadow-md">
          <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
          <p className="text-blue-100 mb-6">Search our knowledge base or browse categories below</p>
          
          <div className="relative max-w-2xl bg-white rounded-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {supportOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all hover:border-blue-200 text-left"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <option.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{option.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{option.desc}</p>
            </button>
          ))}
        </div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {faqCategories.map((category, catIndex) => (
            <div key={catIndex} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-blue-50 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <category.icon className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-gray-900">{category.title}</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {category.faqs.map((faq, faqIndex) => (
                  <details key={faqIndex} className="group">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                      <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                      <ChevronRight className="w-4 h-4 text-blue-500 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-4 pb-4 text-sm text-gray-600">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="#" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group">
              <Video className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
              <div>
                <p className="font-medium text-gray-900 group-hover:text-blue-700">Video Tutorials</p>
                <p className="text-sm text-gray-500">Learn with step-by-step guides</p>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group">
              <Book className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
              <div>
                <p className="font-medium text-gray-900 group-hover:text-blue-700">User Manual</p>
                <p className="text-sm text-gray-500">Complete documentation</p>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors group">
              <FileText className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
              <div>
                <p className="font-medium text-gray-900 group-hover:text-blue-700">Release Notes</p>
                <p className="text-sm text-gray-500">Latest updates and features</p>
              </div>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpSupport;