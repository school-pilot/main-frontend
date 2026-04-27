import { useState, useEffect } from "react";
import { subscriptionsAPI } from "../../services/api";

const SubscriptionPlans = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [plans, setPlans] = useState([]); // always array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [currentRes, plansRes] = await Promise.all([
        subscriptionsAPI.current(),
        subscriptionsAPI.plans(),
      ]);

      // ✅ Handle current plan safely
      setCurrentPlan(currentRes?.data || null);

      // ✅ FIX: Ensure plans is ALWAYS an array
      const plansData =
        plansRes?.data?.data || // case: { data: [...] }
        plansRes?.data?.plans || // case: { plans: [...] }
        plansRes?.data || // case: already array
        [];

      setPlans(Array.isArray(plansData) ? plansData : []);
    } catch (err) {
      setError("Failed to load subscription data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await subscriptionsAPI.upgrade({ plan_id: planId });
      setSuccess("Subscription upgraded successfully");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upgrade subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Subscription Plans</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Current Plan */}
      {currentPlan && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Plan</h2>

          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-blue-600">
              {currentPlan.name || "Free"}
            </div>

            {currentPlan.status && (
              <span
                className={`px-2 py-1 rounded text-sm ${
                  currentPlan.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {currentPlan.status}
              </span>
            )}
          </div>

          {currentPlan.expires_at && (
            <p className="text-sm text-gray-500 mt-2">
              Expires:{" "}
              {new Date(currentPlan.expires_at).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.isArray(plans) &&
          plans.map((plan) => (
            <div key={plan.id} className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>

              <div className="text-3xl font-bold mb-4">
                {plan.price === 0 ? "Free" : `$${plan.price}`}
                {plan.price > 0 && (
                  <span className="text-sm font-normal">/month</span>
                )}
              </div>

              <ul className="space-y-2 mb-4">
                {Array.isArray(plan.features) &&
                  plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading || currentPlan?.name === plan.name}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentPlan?.name === plan.name
                  ? "Current Plan"
                  : "Upgrade"}
              </button>
            </div>
          ))}

        {!loading && plans.length === 0 && (
          <p className="text-gray-500">No plans available.</p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlans;