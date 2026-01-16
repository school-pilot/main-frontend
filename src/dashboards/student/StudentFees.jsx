import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  CreditCard,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Download,
  Eye,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Clock,
  Receipt,
  Shield,
  History
} from 'lucide-react';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';

const StudentFees = () => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockInvoices = [
        {
          id: 1,
          invoice_number: 'INV-2024-001',
          description: 'Term 1 Tuition Fee',
          amount: 1200,
          paid_amount: 1200,
          due_date: '2024-01-15',
          status: 'paid',
          category: 'Tuition',
          issue_date: '2024-01-01',
          payment_date: '2024-01-10',
          payment_method: 'Bank Transfer',
          transaction_id: 'TRX-001234'
        },
        {
          id: 2,
          invoice_number: 'INV-2024-002',
          description: 'Term 1 Examination Fee',
          amount: 150,
          paid_amount: 150,
          due_date: '2024-01-20',
          status: 'paid',
          category: 'Examination',
          issue_date: '2024-01-05',
          payment_date: '2024-01-18',
          payment_method: 'Credit Card',
          transaction_id: 'TRX-001235'
        },
        {
          id: 3,
          invoice_number: 'INV-2024-003',
          description: 'Term 2 Tuition Fee',
          amount: 1200,
          paid_amount: 600,
          due_date: '2024-03-15',
          status: 'partial',
          category: 'Tuition',
          issue_date: '2024-03-01',
          payment_date: '2024-03-10',
          payment_method: 'Bank Transfer',
          transaction_id: 'TRX-001236'
        },
        {
          id: 4,
          invoice_number: 'INV-2024-004',
          description: 'Sports Activity Fee',
          amount: 200,
          paid_amount: 0,
          due_date: '2024-03-31',
          status: 'unpaid',
          category: 'Activities',
          issue_date: '2024-03-15',
          payment_date: null,
          payment_method: null,
          transaction_id: null
        },
        {
          id: 5,
          invoice_number: 'INV-2024-005',
          description: 'Library Fee',
          amount: 100,
          paid_amount: 0,
          due_date: '2024-02-28',
          status: 'overdue',
          category: 'Library',
          issue_date: '2024-02-01',
          payment_date: null,
          payment_method: null,
          transaction_id: null
        },
        {
          id: 6,
          invoice_number: 'INV-2024-006',
          description: 'Computer Lab Fee',
          amount: 250,
          paid_amount: 250,
          due_date: '2024-02-15',
          status: 'paid',
          category: 'Laboratory',
          issue_date: '2024-02-01',
          payment_date: '2024-02-10',
          payment_method: 'Mobile Payment',
          transaction_id: 'TRX-001237'
        }
      ];

      const mockPayments = [
        {
          id: 1,
          invoice_number: 'INV-2024-001',
          amount: 1200,
          payment_date: '2024-01-10',
          method: 'Bank Transfer',
          reference: 'TRX-001234',
          status: 'completed'
        },
        {
          id: 2,
          invoice_number: 'INV-2024-002',
          amount: 150,
          payment_date: '2024-01-18',
          method: 'Credit Card',
          reference: 'TRX-001235',
          status: 'completed'
        },
        {
          id: 3,
          invoice_number: 'INV-2024-003',
          amount: 600,
          payment_date: '2024-03-10',
          method: 'Bank Transfer',
          reference: 'TRX-001236',
          status: 'completed'
        },
        {
          id: 4,
          invoice_number: 'INV-2024-006',
          amount: 250,
          payment_date: '2024-02-10',
          method: 'Mobile Payment',
          reference: 'TRX-001237',
          status: 'completed'
        }
      ];

      setInvoices(mockInvoices);
      setPayments(mockPayments);
      
      const totalPaid = mockInvoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      const totalPending = mockInvoices
        .filter(inv => inv.status !== 'paid')
        .reduce((sum, inv) => sum + (inv.amount - inv.paid_amount), 0);
      
      const totalOverdue = mockInvoices
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      setSummary({
        totalPaid,
        totalPending,
        totalOverdue,
        totalInvoices: mockInvoices.length,
        paidInvoices: mockInvoices.filter(inv => inv.status === 'paid').length,
        pendingInvoices: mockInvoices.filter(inv => inv.status === 'unpaid' || inv.status === 'partial').length
      });
      
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'unpaid':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'overdue':
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Tuition':
        return 'bg-blue-100 text-blue-800';
      case 'Examination':
        return 'bg-purple-100 text-purple-800';
      case 'Activities':
        return 'bg-pink-100 text-pink-800';
      case 'Library':
        return 'bg-indigo-100 text-indigo-800';
      case 'Laboratory':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

  const handleMakePayment = (invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetails(true);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-600">View and manage your fee invoices and payments</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Statement</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Paid</p>
              <h3 className="text-2xl font-bold text-green-900 mt-2">
                ${summary.totalPaid?.toLocaleString()}
              </h3>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 ml-1">All fees paid on time</span>
              </div>
            </div>
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending Amount</p>
              <h3 className="text-2xl font-bold text-yellow-900 mt-2">
                ${summary.totalPending?.toLocaleString()}
              </h3>
              <div className="flex items-center mt-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-600 ml-1">Payment pending</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Overdue Amount</p>
              <h3 className="text-2xl font-bold text-orange-900 mt-2">
                ${summary.totalOverdue?.toLocaleString()}
              </h3>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-600 ml-1">Immediate attention needed</span>
              </div>
            </div>
            <div className="p-3 bg-orange-500 rounded-lg">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Invoices</p>
              <h3 className="text-2xl font-bold text-blue-900 mt-2">
                {summary.totalInvoices}
              </h3>
              <div className="flex items-center mt-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-600 ml-1">
                  {summary.paidInvoices} paid, {summary.pendingInvoices} pending
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'invoices', 'payments', 'history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-1 py-4 text-sm font-medium border-b-2 capitalize transition-colors ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                {tab === 'overview' && <DollarSign className="w-4 h-4" />}
                {tab === 'invoices' && <FileText className="w-4 h-4" />}
                {tab === 'payments' && <CreditCard className="w-4 h-4" />}
                {tab === 'history' && <History className="w-4 h-4" />}
                <span>{tab}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm p-4"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search invoices by number or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Payment Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-4">
              {invoices.slice(0, 3).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(invoice.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">{invoice.description}</h4>
                      <p className="text-sm text-gray-600">{invoice.invoice_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${invoice.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700">
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {payments.slice(0, 3).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Payment Received</p>
                      <p className="text-sm text-gray-600">{payment.invoice_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-900">${payment.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{new Date(payment.payment_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'invoices' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentInvoices.map((invoice, index) => (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{invoice.invoice_number}</div>
                      <div className="text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(invoice.category)}`}>
                          {invoice.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{invoice.description}</div>
                      <div className="text-sm text-gray-500">
                        Issued: {new Date(invoice.issue_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${invoice.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${invoice.paid_amount.toLocaleString()}
                      </div>
                      {invoice.paid_amount > 0 && (
                        <div className="text-xs text-gray-500">
                          {((invoice.paid_amount / invoice.amount) * 100).toFixed(0)}% paid
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(invoice.due_date).toLocaleDateString()}
                      </div>
                      {invoice.status === 'overdue' && (
                        <div className="text-xs text-orange-600">Overdue</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(invoice.status)}
                        <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="text-primary-600 hover:text-primary-900 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {invoice.status !== 'paid' && (
                          <button
                            onClick={() => handleMakePayment(invoice)}
                            className="px-3 py-1 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredInvoices.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </motion.div>
      )}

      {activeTab === 'payments' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Payment Successful</h4>
                    <p className="text-sm text-gray-600">Invoice: {payment.invoice_number}</p>
                    <p className="text-xs text-gray-500">Reference: {payment.reference}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-900">${payment.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{new Date(payment.payment_date).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 capitalize">{payment.method}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl shadow-sm p-6 border border-primary-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Accepted Payment Methods</h3>
            <p className="text-sm text-gray-600">Secure and convenient payment options</p>
          </div>
          <Shield className="w-6 h-6 text-primary-600" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-lg text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Credit/Debit Card</p>
            <p className="text-xs text-gray-500">Visa, MasterCard</p>
          </div>
          
          <div className="p-4 bg-white rounded-lg text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Bank Transfer</p>
            <p className="text-xs text-gray-500">Online Banking</p>
          </div>
          
          <div className="p-4 bg-white rounded-lg text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Receipt className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Mobile Payment</p>
            <p className="text-xs text-gray-500">PayPal, Mobile Money</p>
          </div>
          
          <div className="p-4 bg-white rounded-lg text-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-sm font-medium text-gray-900">Cash Payment</p>
            <p className="text-xs text-gray-500">At school office</p>
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showPaymentModal && selectedInvoice && (
          <PaymentModal
            invoice={selectedInvoice}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedInvoice(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInvoiceDetails && selectedInvoice && (
          <InvoiceDetailsModal
            invoice={selectedInvoice}
            onClose={() => {
              setShowInvoiceDetails(false);
              setSelectedInvoice(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Payment Modal Component
const PaymentModal = ({ invoice, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      alert('Payment processed successfully!');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Make Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Invoice Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Invoice:</span>
              <span className="font-medium">{invoice.invoice_number}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Description:</span>
              <span className="font-medium">{invoice.description}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Amount Due:</span>
              <span className="text-xl font-bold text-primary-600">
                ${(invoice.amount - invoice.paid_amount).toLocaleString()}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'card', label: 'Card', icon: CreditCard },
                  { value: 'bank', label: 'Bank', icon: DollarSign },
                  { value: 'mobile', label: 'Mobile', icon: Receipt },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`p-3 border rounded-lg text-center transition-all ${
                      paymentMethod === method.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    <method.icon className={`w-5 h-5 mx-auto mb-1 ${
                      paymentMethod === method.value ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <span className={`text-sm ${
                      paymentMethod === method.value ? 'text-primary-700 font-medium' : 'text-gray-600'
                    }`}>
                      {method.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Details */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm text-green-700">
                  Your payment is secured with SSL encryption. We never store your card details.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  `Pay $${(invoice.amount - invoice.paid_amount).toLocaleString()}`
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Invoice Details Modal Component
const InvoiceDetailsModal = ({ invoice, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Invoice Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Invoice Header */}
          <div className="mb-8 p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{invoice.invoice_number}</h3>
                <p className="text-gray-600">{invoice.description}</p>
              </div>
              <div className="text-right">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Issue Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="font-medium">{new Date(invoice.issue_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(invoice.category)}`}>
                      {invoice.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Amount:</span>
                  <span className="font-medium">${invoice.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="text-green-600 font-medium">${invoice.paid_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Balance Due:</span>
                  <span className="text-primary-600 font-bold text-lg">
                    ${(invoice.amount - invoice.paid_amount).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {invoice.payment_date && (
            <div className="mb-8">
              <h4 className="text-sm font-medium text-gray-500 mb-4">Payment Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Payment Date:</span>
                    <p className="font-medium">{new Date(invoice.payment_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Method:</span>
                    <p className="font-medium">{invoice.payment_method}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Transaction ID:</span>
                    <p className="font-medium">{invoice.transaction_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Status:</span>
                    <p className="font-medium text-green-600">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Download className="w-4 h-4 inline mr-2" />
              Download Invoice
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'unpaid':
      return 'bg-red-100 text-red-800';
    case 'partial':
      return 'bg-yellow-100 text-yellow-800';
    case 'overdue':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'Tuition':
      return 'bg-blue-100 text-blue-800';
    case 'Examination':
      return 'bg-purple-100 text-purple-800';
    case 'Activities':
      return 'bg-pink-100 text-pink-800';
    case 'Library':
      return 'bg-indigo-100 text-indigo-800';
    case 'Laboratory':
      return 'bg-teal-100 text-teal-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default StudentFees;