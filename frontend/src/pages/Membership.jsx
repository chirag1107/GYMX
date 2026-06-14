import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { plans } from '../data/plans';
import './Membership.css';

import { useMembership } from '../context/MembershipContext';
import { useNavigate } from 'react-router-dom';

const Membership = () => {
    const { currentTier } = useMembership();
    const navigate = useNavigate();

    const handleSubscribe = (tierId) => {
        navigate(`/membership/${tierId}`);
    };

    return (

        <div className="membership-page page-content">
            <div className="container">
                <Link to="/" className="back-link"><ArrowLeft size={20} /> Back to Home</Link>
                <div className="section-header">
                    <h1>MEMBERSHIP <span className="text-highlight">PLANS</span></h1>
                    <p>Invest in yourself. Choose the package that suits your goals.</p>
                </div>

                <div className="pricing-grid">
                    {plans.map((plan) => (
                        <div key={plan.id} className={`pricing-card ${plan.recommended ? 'recommended' : ''}`}>
                            {plan.recommended && <div className="badge">Most Popular</div>}
                            <div className="plan-header">
                                <h3>{plan.name}</h3>
                                <div className="price">
                                    {plan.price}<span>{plan.period}</span>
                                </div>
                            </div>
                            <ul className="plan-features">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className={feature.included ? '' : 'disabled'}>
                                        {feature.included ? <CheckCircle className="check-icon" size={18} /> : <XCircle className="x-icon" size={18} />}
                                        {feature.name}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                className={`btn btn-block ${currentTier === plan.id ? 'btn-secondary' : 'btn-primary'}`}
                                disabled={currentTier === plan.id}
                            >
                                {currentTier === plan.id ? 'Current Plan' : 'Choose Plan'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Membership;
