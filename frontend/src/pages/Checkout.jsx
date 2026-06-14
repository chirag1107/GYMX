import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { plans } from '../data/plans';
import { CreditCard, Lock, CheckCircle, ArrowLeft, Wallet, Smartphone, Globe, Landmark } from 'lucide-react';
import { useMembership } from '../context/MembershipContext';
import './Checkout.css';

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const plan = plans.find(p => p.id === parseInt(id));
    const { upgradeTier } = useMembership();

    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'gpay', 'phonepe', 'amazonpay', 'paypal', 'other'
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (!plan) {
        return <div className="checkout-page page-content container">Plan not found</div>;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            upgradeTier(plan.id);
            setIsProcessing(false);
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        }, 2000);
    };

    const renderPaymentContent = () => {
        switch (paymentMethod) {
            case 'card':
                return (
                    <form onSubmit={handleSubmit} className="payment-form">
                        <div className="form-group">
                            <label>Name on Card</label>
                            <input
                                type="text"
                                name="cardName"
                                placeholder="John Doe"
                                value={formData.cardName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Card Number</label>
                            <div className="input-with-icon">
                                <CreditCard className="input-icon" size={20} />
                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="0000 0000 0000 0000"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    required
                                    maxLength="19"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input
                                    type="text"
                                    name="expiry"
                                    placeholder="MM/YY"
                                    value={formData.expiry}
                                    onChange={handleInputChange}
                                    required
                                    maxLength="5"
                                />
                            </div>
                            <div className="form-group">
                                <label>CVV</label>
                                <div className="input-with-icon">
                                    <Lock className="input-icon" size={18} />
                                    <input
                                        type="password"
                                        name="cvv"
                                        placeholder="123"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                        required
                                        maxLength="3"
                                    />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-block pay-btn" disabled={isProcessing}>
                            {isProcessing ? 'Processing...' : `Pay ${plan.price}`}
                        </button>
                    </form>
                );
            case 'gpay':
            case 'phonepe':
            case 'amazonpay': {
                const providerName = paymentMethod === 'gpay' ? 'Google Pay' : paymentMethod === 'phonepe' ? 'PhonePe' : 'Amazon Pay';
                const upiString = encodeURIComponent(`upi://pay?pa=chiragpatil1106@fam&pn=Chirag Patil&cu=INR`);
                return (
                    <div className="payment-method-content upi-view">
                        <h3>Pay using {providerName}</h3>
                        <p>Scan the QR code below using your {providerName} app</p>
                        <div className="qr-container">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${upiString}`} alt="UPI QR Scanner" className="qr-image" />
                        </div>
                        <div className="upi-id-display">chiragpatil1106@fam</div>
                        <ul className="payment-steps">
                            <li><span className="step-number">1</span> Open your {providerName} app</li>
                            <li><span className="step-number">2</span> Scan the QR code or enter UPI ID</li>
                            <li><span className="step-number">3</span> Confirm payment of {plan.price}</li>
                        </ul>
                        <button onClick={handleSubmit} className="btn btn-primary btn-block" disabled={isProcessing}>
                            {isProcessing ? 'Waiting for confirmation...' : 'Already Paid? Click to Verify'}
                        </button>
                    </div>
                );
            }
            case 'paypal':
                return (
                    <div className="payment-method-content paypal-view">
                        <Globe size={48} color="#0070ba" style={{ marginBottom: '1rem' }} />
                        <h3>PayPal Checkout</h3>
                        <p>You will be redirected to PayPal to complete your purchase securely.</p>
                        <ul className="payment-steps">
                            <li><span className="step-number">1</span> Log in to your PayPal account</li>
                            <li><span className="step-number">2</span> Choose your funding source</li>
                            <li><span className="step-number">3</span> Review and complete payment</li>
                        </ul>
                        <button onClick={handleSubmit} className="btn btn-primary btn-block" disabled={isProcessing} style={{ background: '#ffc439', color: '#111' }}>
                            {isProcessing ? 'Redirecting...' : 'Continue with PayPal'}
                        </button>
                    </div>
                );
            default:
                return (
                    <div className="payment-method-content upi-view">
                        <Landmark size={48} style={{ marginBottom: '1rem' }} />
                        <h3>Other Payment Methods</h3>
                        <p>Select your preferred payment option from the list above.</p>
                    </div>
                );
        }
    };

    if (showSuccess) {
        return (
            <div className="checkout-page page-content">
                <div className="container success-container">
                    <CheckCircle size={64} className="success-icon" />
                    <h2>Payment Successful!</h2>
                    <p>You have successfully subscribed to the {plan.name} Plan.</p>
                    <p>Welcome to the Elite community! Redirecting you to home...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page page-content">
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '0' }}>
                <Link to="/membership" className="back-link">
                    <ArrowLeft size={20} /> Back to Plans
                </Link>
            </div>
            <div className="container checkout-container" style={{ paddingTop: '1rem' }}>
                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-card">
                        <div className="plan-name">{plan.name} Plan</div>
                        <div className="plan-price">{plan.price}<span>{plan.period}</span></div>
                        <ul className="summary-features">
                            {plan.features.slice(0, 3).map((f, i) => (
                                <li key={i}>{f.name}</li>
                            ))}
                        </ul>
                        <div className="total-row">
                            <span>Total due today</span>
                            <span>{plan.price}</span>
                        </div>
                    </div>
                </div>

                <div className="payment-form-container">
                    <h2>Select Payment Method</h2>

                    <div className="payment-methods">
                        <button
                            className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('card')}
                        >
                            <CreditCard size={24} />
                            <span>Card</span>
                        </button>
                        <button
                            className={`method-btn ${paymentMethod === 'gpay' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('gpay')}
                        >
                            <Smartphone size={24} />
                            <span>GPay</span>
                        </button>
                        <button
                            className={`method-btn ${paymentMethod === 'phonepe' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('phonepe')}
                        >
                            <Wallet size={24} />
                            <span>PhonePe</span>
                        </button>
                        <button
                            className={`method-btn ${paymentMethod === 'amazonpay' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('amazonpay')}
                        >
                            <Smartphone size={24} />
                            <span>Amazon Pay</span>
                        </button>
                        <button
                            className={`method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                            onClick={() => setPaymentMethod('paypal')}
                        >
                            <Globe size={24} />
                            <span>PayPal</span>
                        </button>
                    </div>

                    <div className="payment-method-details">
                        {renderPaymentContent()}
                    </div>

                    <p className="secure-badge">
                        <Lock size={14} /> Payments are secure and encrypted
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
