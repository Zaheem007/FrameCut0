import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { GLOBAL_CSS, RippleButton, toast } from "../theme";

const styles = `
  ${GLOBAL_CSS}
  .pay-page { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; padding: 60px 24px; font-family: var(--ff-ui); }
  .pay-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 48px 44px; max-width: 480px; width: 100%; box-shadow: var(--shadow-lg); }

  .pay-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--violet); margin-bottom: 6px; }
  .pay-title { font-family: var(--ff-display); font-size: 28px; font-weight: 700; color: var(--plum); margin-bottom: 4px; }
  .pay-sub { font-size: 13px; color: var(--muted); font-weight: 300; margin-bottom: 32px; }

  .pay-breakdown { background: var(--bg2); border-radius: var(--radius); padding: 20px 22px; margin-bottom: 24px; }
  .pay-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 13px; }
  .pay-row:last-child { margin-bottom: 0; }
  .pay-row-label { color: var(--muted); font-weight: 400; }
  .pay-row-val { color: var(--plum); font-weight: 600; }
  .pay-divider { height: 1px; background: var(--border); margin: 12px 0; }

  .pay-advance-box { background: rgba(196,122,82,0.07); border: 1.5px solid rgba(196,122,82,0.25); border-radius: var(--radius); padding: 18px 20px; margin-bottom: 24px; }
  .pay-advance-label { font-size: 9.5px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--terra); margin-bottom: 4px; }
  .pay-advance-amount { font-family: var(--ff-display); font-size: 38px; font-weight: 700; color: var(--terra); }
  .pay-advance-note { font-size: 11px; color: var(--muted); margin-top: 4px; font-weight: 300; }

  .pay-remaining-note { font-size: 12px; color: var(--muted); font-weight: 300; line-height: 1.7; margin-bottom: 28px; padding: 12px 14px; border-left: 3px solid var(--border2); background: var(--surface2); border-radius: 0 var(--radius) var(--radius) 0; }

  .pay-test-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(176,120,48,0.1); border: 1px solid rgba(176,120,48,0.3); border-radius: 99px; padding: 4px 12px; font-size: 10px; font-weight: 700; color: var(--amber); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 20px; }

  .pay-success { text-align: center; }
  .pay-success-icon { font-size: 64px; margin-bottom: 16px; }
  .pay-success-title { font-family: var(--ff-display); font-size: 24px; font-weight: 700; color: var(--green); margin-bottom: 10px; }
  .pay-success-text { font-size: 13px; color: var(--muted); font-weight: 300; line-height: 1.8; margin-bottom: 28px; }
  .pay-receipt { background: var(--bg2); border-radius: var(--radius); padding: 16px 20px; margin-bottom: 24px; text-align: left; }
  .pay-receipt-row { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 8px; }
  .pay-receipt-row:last-child { margin-bottom: 0; }
  .pay-receipt-label { color: var(--muted); font-weight: 300; }
  .pay-receipt-val { color: var(--plum); font-weight: 600; }
  .pay-txn { font-size: 10px; color: var(--border2); margin-top: 12px; text-align: center; font-family: monospace; }
`;

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txnId, setTxnId] = useState("");

  const {
    bookingId,
    totalAmount = 0,
    clientEmail = "",
    videographerName = "Videographer",
    eventDate = "",
    eventLocation = "",
    selectedService = "",
  } = location.state || {};

  const advance = totalAmount ? Math.round(totalAmount * 0.30) : 0;
  const remaining = totalAmount - advance;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handlePay = async () => {
    if (!bookingId) { toast("Booking details missing.", "error"); return; }
    if (!advance) { toast("No amount to pay. Please select a package.", "warning"); return; }
    setLoading(true);

    try {
      // Step 1 — Create Razorpay order on backend
      const orderRes = await axios.post("https://framecut-rqms.onrender.com/api/payments/create-order", {
        bookingId,
        totalAmount,
        clientEmail,
      });

      const { orderId, key, paymentId } = orderRes.data;

      // Step 2 — Open Razorpay checkout
      const options = {
        key,
        amount: advance * 100,
        currency: "INR",
        name: "FrameCut",
        description: `Advance booking payment — ${videographerName}`,
        order_id: orderId,
        prefill: { email: clientEmail },
        theme: { color: "#3d1f4e" },
        handler: async (response) => {
          try {
            // Step 3 — Verify payment on backend
            await axios.post("https://framecut-rqms.onrender.com/api/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentId,
              bookingId,
            });
            setTxnId(response.razorpay_payment_id);
            setPaid(true);
            toast("Advance payment successful!", "success");
          } catch {
            toast("Payment verification failed. Contact support.", "error");
          }
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled.", "info");
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast("Failed to initiate payment. Try again.", "error");
    }

    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="pay-page">
        <div className="pay-card">
          {paid ? (
            <div className="pay-success">
              <div className="pay-success-icon">✅</div>
              <h2 className="pay-success-title">Payment Successful!</h2>
              <p className="pay-success-text">
                Your advance has been received. Your booking with <strong>{videographerName}</strong> is now fully confirmed.
              </p>
              <div className="pay-receipt">
                <div className="pay-receipt-row"><span className="pay-receipt-label">Videographer</span><span className="pay-receipt-val">{videographerName}</span></div>
                {selectedService && <div className="pay-receipt-row"><span className="pay-receipt-label">Package</span><span className="pay-receipt-val">{selectedService}</span></div>}
                {eventDate && <div className="pay-receipt-row"><span className="pay-receipt-label">Date</span><span className="pay-receipt-val">{eventDate}</span></div>}
                {eventLocation && <div className="pay-receipt-row"><span className="pay-receipt-label">Venue</span><span className="pay-receipt-val">{eventLocation}</span></div>}
                <div className="pay-divider" />
                <div className="pay-receipt-row">
                  <span className="pay-receipt-label">Advance Paid</span>
                  <span className="pay-receipt-val" style={{ color: "var(--green)" }}>₹{advance.toLocaleString()}</span>
                </div>
                <div className="pay-receipt-row">
                  <span className="pay-receipt-label">Remaining (on event day)</span>
                  <span className="pay-receipt-val">₹{remaining.toLocaleString()}</span>
                </div>
                {txnId && <p className="pay-txn">TXN: {txnId}</p>}
              </div>
              <RippleButton className="fc-btn-terra fc-btn-lg fc-btn-full" onClick={() => navigate("/home")}>
                View My Bookings
              </RippleButton>
            </div>
          ) : (
            <>
              <div className="pay-test-badge">🔐 Test Mode</div>
              <p className="pay-eyebrow">Secure Checkout</p>
              <h2 className="pay-title">Advance Payment</h2>
              <p className="pay-sub">Pay 30% now to confirm your booking with {videographerName}</p>

              <div className="pay-breakdown">
                <div className="pay-row">
                  <span className="pay-row-label">Package Total</span>
                  <span className="pay-row-val">₹{Number(totalAmount).toLocaleString()}</span>
                </div>
                <div className="pay-divider" />
                <div className="pay-row">
                  <span className="pay-row-label">Advance Now (30%)</span>
                  <span className="pay-row-val" style={{ color: "var(--terra)" }}>₹{advance.toLocaleString()}</span>
                </div>
                <div className="pay-row">
                  <span className="pay-row-label">Remaining (70%)</span>
                  <span className="pay-row-val">₹{remaining.toLocaleString()}</span>
                </div>
              </div>

              <div className="pay-advance-box">
                <p className="pay-advance-label">Due Now</p>
                <p className="pay-advance-amount">₹{advance.toLocaleString()}</p>
                <p className="pay-advance-note">30% advance to confirm your booking</p>
              </div>

              <p className="pay-remaining-note">
                The remaining <strong>₹{remaining.toLocaleString()}</strong> is to be paid directly to the videographer on the day of the event.
              </p>

              <RippleButton className="fc-btn-terra fc-btn-lg fc-btn-full" onClick={handlePay} disabled={loading}>
                {loading ? "Opening Payment..." : `Pay ₹${advance.toLocaleString()} via Razorpay`}
              </RippleButton>
              <RippleButton className="fc-btn-ghost fc-btn-sm fc-btn-full" onClick={() => navigate(-1)} style={{ marginTop: "10px" }}>
                Go Back
              </RippleButton>

              <p style={{ fontSize: "11px", color: "var(--border2)", textAlign: "center", marginTop: "16px" }}>
                🔒 Payments secured by Razorpay · Test mode active
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default PaymentPage;