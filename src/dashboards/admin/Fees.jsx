import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Download,
  Eye,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { feesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';

const Fees = () => {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [showActions, setShowActions] = useState(null);
  const [activeTab, setActiveTab] = useState('invoices');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoicesRes, paymentsRes] = await Promise.all([
        feesAPI.getInvoices(),
        feesAPI.getPaymentHistory(),
      ]);
      setInvoices(invoicesRes.data);
      setPayments(paymentsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (invoiceData) => {
    try {
      await feesAPI.createStructure(invoiceData);
      toast.success('Invoice created successfully');
      fetchData();
      setShowCreateInvoice(false);
    } catch (error) {
      toast.error('Failed to create invoice');
    }
  };

  const handleRecordPayment = async (paymentData) => {
    try {
      await feesAPI.recordPayment(paymentData);
      toast.success('Payment recorded successfully');
      fetchData();
      setShowRecordPayment(false);
    } catch (error) {
      toast.error('Failed to record payment');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'unpaid':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    activeTab === 'invoices'
      ? filteredInvoices.slice(indexOfFirstItem, indexOfLastItem)
      : payments.slice(indexOfFirstItem, indexOfLastItem);

  const totalRevenue = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingAmount = invoices
    .filter((inv) => inv.status !== 'paid')
    .reduce((sum, inv) => sum + (inv.amount - inv.paid_amount), 0);

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
          <p className="text-gray-600">Manage fee invoices and payments</p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRecordPayment(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <DollarSign className="w-4 h-4" />
            <span>Record Payment</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateInvoice(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ${totalRevenue.toLocaleString()}
              </h3>
            </div>
            <CreditCard className="w-10 h-10 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Amount</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ${pendingAmount.toLocaleString()}
              </h3>
            </div>
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Invoices</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {invoices.length}
              </h3>
            </div>
            <FileText className="w-10 h-10 text-primary-600" />
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'invoices'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Invoices ({invoices.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-1 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'payments'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Payment History ({payments.length})</span>
            </div>
          </button>
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
              placeholder="Search by student name or invoice number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {activeTab === 'invoices' && (
            <div className="flex items-center space-x-3">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          )}

          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        {activeTab === 'invoices' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Invoice #</th>
                  <th className="table-header">Student</th>
                  <th className="table-header">Class</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Paid</th>
                  <th className="table-header">Due Date</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((invoice, index) => (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="table-cell font-medium">
                      {invoice.invoice_number}
                    </td>
                    <td className="table-cell">{invoice.student_name}</td>
                    <td className="table-cell">{invoice.class}</td>
                    <td className="table-cell font-medium">
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td className="table-cell">
                      ${invoice.paid_amount?.toLocaleString() || 0}
                    </td>
                    <td className="table-cell">
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center">
                        {getStatusIcon(invoice.status)}
                        <span
                          className={`ml-2 px-3 py-1 rounded-full text-sm ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowActions(
                                showActions === invoice.id ? null : invoice.id
                              )
                            }
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </button>

                          <AnimatePresence>
                            {showActions === invoice.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                              >
                                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  <FileText className="w-4 h-4 mr-2" />
                                  Download Invoice
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  <DollarSign className="w-4 h-4 mr-2" />
                                  Record Payment
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Extend Due Date
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Payment #</th>
                  <th className="table-header">Student</th>
                  <th className="table-header">Invoice #</th>
                  <th className="table-header">Amount</th>
                  <th className="table-header">Method</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Recorded By</th>
                  <th className="table-header">Receipt</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="table-cell font-medium">
                      {payment.payment_number}
                    </td>
                    <td className="table-cell">{payment.student_name}</td>
                    <td className="table-cell">{payment.invoice_number}</td>
                    <td className="table-cell font-medium">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="table-cell capitalize">{payment.method}</td>
                    <td className="table-cell">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </td>
                    <td className="table-cell">{payment.recorded_by}</td>
                    <td className="table-cell">
                      <button className="text-primary-600 hover:text-primary-700">
                        Download
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalItems={
              activeTab === 'invoices' ? filteredInvoices.length : payments.length
            }
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateInvoice && (
          <CreateInvoiceModal
            onClose={() => setShowCreateInvoice(false)}
            onSubmit={handleCreateInvoice}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRecordPayment && (
          <RecordPaymentModal
            invoices={invoices.filter((inv) => inv.status !== 'paid')}
            onClose={() => setShowRecordPayment(false)}
            onSubmit={handleRecordPayment}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Modal Components
const CreateInvoiceModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    class_id: '',
    fee_category: '',
    amount: '',
    due_date: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Create Fee Invoice</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                </label>
                <select
                  required
                  className="input-field"
                  value={formData.class_id}
                  onChange={(e) =>
                    setFormData({ ...formData, class_id: e.target.value })
                  }
                >
                  <option value="">Select Class</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee Category *
                </label>
                <select
                  required
                  className="input-field"
                  value={formData.fee_category}
                  onChange={(e) =>
                    setFormData({ ...formData, fee_category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="tuition">Tuition Fee</option>
                  <option value="exam">Examination Fee</option>
                  <option value="library">Library Fee</option>
                  <option value="sports">Sports Fee</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    required
                    className="input-field pl-10"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData({ ...formData, due_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="input-field"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Create Invoice
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const RecordPaymentModal = ({ invoices, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    invoice_id: '',
    amount: '',
    payment_method: 'cash',
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const selectedInvoice = invoices.find((inv) => inv.id === formData.invoice_id);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Invoice *
              </label>
              <select
                required
                className="input-field"
                value={formData.invoice_id}
                onChange={(e) =>
                  setFormData({ ...formData, invoice_id: e.target.value })
                }
              >
                <option value="">Select Invoice</option>
                {invoices.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.invoice_number} - {invoice.student_name} - $
                    {invoice.amount - (invoice.paid_amount || 0)} due
                  </option>
                ))}
              </select>
            </div>

            {selectedInvoice && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Invoice Total</p>
                    <p className="font-medium">${selectedInvoice.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Already Paid</p>
                    <p className="font-medium">${selectedInvoice.paid_amount || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Balance Due</p>
                    <p className="font-medium text-green-600">
                      ${selectedInvoice.amount - (selectedInvoice.paid_amount || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium">
                      {new Date(selectedInvoice.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    required
                    className="input-field pl-10"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    max={selectedInvoice?.amount - (selectedInvoice?.paid_amount || 0)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  required
                  className="input-field"
                  value={formData.payment_method}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_method: e.target.value })
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="mobile">Mobile Payment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date *
                </label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.payment_date}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_date: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                className="input-field"
                rows={2}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional notes..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Record Payment
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Fees;