import { useState } from "react";
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

  /* Success screen */
  .pay-success { text-align: center; }
  .pay-success-icon { font-size: 64px; margin-bottom: 16px; }
  .pay-success-title { font-family: var(--ff-display); font-size: 24px; font-weight: 700; color: var(--green); margin-bottom: 10px; }
  .pay-success-text { font-size: 13px; color: var(--muted); font-weight: 300; line-height: 1.8; margin-bottom: 28px; }
  .pay-receipt { background: var(--bg2); border-radius: var(--radius); padding: 16px 20px; margin-bottom: 24px; text-align: left; }
  .pay-receipt-row { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 8px; }
  .pay-receipt-row:last-child { margin-bottom: 0; }
  .pay-receipt-label { color: var(--muted); font-weight: 300; }
  .pay-receipt-val { color: var(--plum); font-weight: 600; }
`;

function PaymentPage() {
  const location = useNavigate ? useLocation() : {};
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    bookingId,
    totalAmount = 0,
    clientEmail = "",
    videographerName = "Videographer",
    eventDate = "",
    eventLocation = "",
    selectedService = "",
  } = location.state || {};

  const advance = Math.round(totalAmount * 0.30);
  const remaining = totalAmount - advance;

  const handlePay = async () => {
    if (!bookingId) { toast("Booking details missing.", "error"); return; }
    setLoading(true);
    try {
      await axios.put(`https://framecut-rqms.onrender.com/api/bookings/pay-advance/${bookingId}`);
      setPaid(true);
      toast("Advance payment successful!", "success");
    } catch {
      toast("Payment failed. Please try again.", "error");
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
                <div className="pay-receipt-row"><span className="pay-receipt-label">Advance Paid</span><span className="pay-receipt-val" style={{ color: "var(--green)" }}>₹{advance.toLocaleString()}</span></div>
                <div className="pay-receipt-row"><span className="pay-receipt-label">Remaining (on event day)</span><span className="pay-receipt-val">₹{remaining.toLocaleString()}</span></div>
              </div>
              <RippleButton className="fc-btn-terra fc-btn-lg fc-btn-full" onClick={() => navigate("/home")}>
                View My Bookings
              </RippleButton>
            </div>
          ) : (
            <>
              <p className="pay-eyebrow">Secure Checkout</p>
              <h2 className="pay-title">Advance Payment</h2>
              <p className="pay-sub">Pay 30% now to confirm your booking with {videographerName}</p>

              <div className="pay-breakdown">
                <div className="pay-row"><span className="pay-row-label">Package Total</span><span className="pay-row-val">₹{Number(totalAmount).toLocaleString()}</span></div>
                <div className="pay-divider" />
                <div className="pay-row"><span className="pay-row-label">Advance Now (30%)</span><span className="pay-row-val" style={{ color: "var(--terra)" }}>₹{advance.toLocaleString()}</span></div>
                <div className="pay-row"><span className="pay-row-label">Remaining (70%)</span><span className="pay-row-val">₹{remaining.toLocaleString()}</span></div>
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
                {loading ? "Processing..." : `Confirm & Pay ₹${advance.toLocaleString()}`}
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