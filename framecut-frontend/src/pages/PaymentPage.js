import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";

const styles = `
  ${GLOBAL_CSS}
  .pay-page { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; padding: 60px 24px; font-family: var(--ff-ui); }
  .pay-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 44px 40px; max-width: 500px; width: 100%; box-shadow: var(--shadow-lg); }
  .pay-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--violet); margin-bottom: 6px; }
  .pay-title { font-family: var(--ff-display); font-size: 28px; font-weight: 700; color: var(--plum); margin-bottom: 4px; }
  .pay-sub { font-size: 13px; color: var(--muted); font-weight: 300; margin-bottom: 32px; }

  .pay-breakdown { background: var(--bg2); border-radius: var(--radius); padding: 20px 22px; margin-bottom: 28px; }
  .pay-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 13px; }
  .pay-row:last-child { margin-bottom: 0; }
  .pay-row-label { color: var(--muted); font-weight: 400; }
  .pay-row-val { color: var(--plum); font-weight: 600; }
  .pay-divider { height: 1px; background: var(--border); margin: 14px 0; }
  .pay-advance-highlight { background: rgba(196,122,82,0.08); border: 1.5px solid rgba(196,122,82,0.25); border-radius: var(--radius); padding: 16px 18px; margin-bottom: 24px; }
  .pay-advance-label { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--terra); margin-bottom: 6px; }
  .pay-advance-amount { font-family: var(--ff-display); font-size: 36px; font-weight: 700; color: var(--terra); }
  .pay-advance-note { font-size: 11px; color: var(--muted); margin-top: 4px; font-weight: 300; }
  .pay-remaining-note { font-size: 12px; color: var(--muted); font-weight: 300; line-height: 1.6; margin-bottom: 28px; padding: 12px 14px; border-left: 3px solid var(--border2); background: var(--surface2); border-radius: 0 var(--radius) var(--radius) 0; }
  .pay-success { text-align: center; padding: 20px 0; }
  .pay-success-icon { font-size: 52px; margin-bottom: 12px; }
  .pay-success-title { font-family: var(--ff-display); font-size: 22px; font-weight: 600; color: var(--green); margin-bottom: 8px; }
  .pay-success-text { font-size: 13px; color: var(--muted); font-weight: 300; line-height: 1.7; }
`;

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Booking details passed from Booking.js via navigate state
  const { bookingId, totalAmount, clientEmail, videographerId, videographerName } = location.state || {};

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const createOrder = async () => {
    if (!bookingId || !totalAmount) { toast("Missing booking details.", "error"); return; }
    setLoading(true);
    try {
      const res = await axios.post("https://framecut-rqms.onrender.com/api/payments/create-order", {
        bookingId, totalAmount, clientEmail, videographerId,
      });
      setOrderData(res.data);
      openRazorpay(res.data);
    } catch {
      toast("Failed to initiate payment. Try again.", "error");
    }
    setLoading(false);
  };

  const openRazorpay = (data) => {
    const options = {
      key: data.key,
      amount: data.advanceAmount * 100,
      currency: "INR",
      name: "FrameCut",
      description: `Advance booking payment for ${videographerName}`,
      order_id: data.orderId,
      handler: async (response) => {
        try {
          await axios.post("https://framecut-rqms.onrender.com/api/payments/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentId: data.paymentId,
          });
          setPaymentDone(true);
          toast("Advance payment successful!", "success");
        } catch {
          toast("Payment verification failed. Contact support.", "error");
        }
      },
      prefill: { email: clientEmail },
      theme: { color: "#3d1f4e" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const advanceAmount = totalAmount ? Math.round(totalAmount * 0.30) : 0;
  const remainingAmount = totalAmount ? totalAmount - advanceAmount : 0;

  return (
    <>
      <style>{styles}</style>
      <div className="pay-page">
        <div className="pay-card">
          {paymentDone ? (
            <div className="pay-success">
              <div className="pay-success-icon">✅</div>
              <h3 className="pay-success-title">Advance Payment Confirmed!</h3>
              <p className="pay-success-text">
                Your advance of <strong>₹{advanceAmount.toLocaleString()}</strong> has been received.<br />
                The remaining <strong>₹{remainingAmount.toLocaleString()}</strong> is due on the event day.<br /><br />
                Your booking with <strong>{videographerName}</strong> is confirmed.
              </p>
              <RippleButton className="fc-btn-terra fc-btn-lg" onClick={() => navigate("/home")} style={{ marginTop: "24px" }}>
                View My Bookings
              </RippleButton>
            </div>
          ) : (
            <>
              <p className="pay-eyebrow">Secure Checkout</p>
              <h2 className="pay-title">Advance Payment</h2>
              <p className="pay-sub">Pay 30% now to confirm your booking with {videographerName}</p>

              <div className="pay-breakdown">
                <div className="pay-row">
                  <span className="pay-row-label">Package Total</span>
                  <span className="pay-row-val">₹{totalAmount?.toLocaleString()}</span>
                </div>
                <div className="pay-divider" />
                <div className="pay-row">
                  <span className="pay-row-label">Advance (30%)</span>
                  <span className="pay-row-val" style={{ color: "var(--terra)" }}>₹{advanceAmount.toLocaleString()}</span>
                </div>
                <div className="pay-row">
                  <span className="pay-row-label">Remaining (70%)</span>
                  <span className="pay-row-val">₹{remainingAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pay-advance-highlight">
                <p className="pay-advance-label">Due Now</p>
                <p className="pay-advance-amount">₹{advanceAmount.toLocaleString()}</p>
                <p className="pay-advance-note">30% advance to confirm your booking</p>
              </div>

              <p className="pay-remaining-note">
                The remaining <strong>₹{remainingAmount.toLocaleString()}</strong> (70%) is to be paid directly to the videographer on the day of the event. No additional online payment will be collected.
              </p>

              <RippleButton className="fc-btn-terra fc-btn-lg fc-btn-full" onClick={createOrder} disabled={loading}>
                {loading ? "Processing..." : `Pay ₹${advanceAmount.toLocaleString()} via Razorpay`}
              </RippleButton>
              <RippleButton className="fc-btn-ghost fc-btn-sm fc-btn-full" onClick={() => navigate(-1)} style={{ marginTop: "10px" }}>
                Go Back
              </RippleButton>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default PaymentPage;