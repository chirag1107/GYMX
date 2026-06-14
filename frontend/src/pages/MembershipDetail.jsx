import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Star } from 'lucide-react';
import { plans } from '../data/plans';
import './MembershipDetail.css';

const MembershipDetail = () => {
    const { id } = useParams();
    const plan = plans.find(p => p.id === parseInt(id));

    if (!plan) {
        return (
            <div className="membership-detail-page page-content">
                <div className="container">
                    <h2>Plan not found</h2>
                    <Link to="/membership" className="btn btn-primary">Back to Plans</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="membership-detail-page page-content">
            <div className="container">
                <Link to="/membership" className="back-link">
                    <ArrowLeft size={20} /> Back to Plans
                </Link>

                <div className="detail-header">
                    <h1>{plan.name} <span className="text-highlight">Plan</span></h1>
                    <p className="plan-description">{plan.description}</p>
                </div>

                <div className="detail-content">
                    <div className="detail-card main-info">
                        <div className="price-tag">
                            <h2>{plan.price}</h2>
                            <span>{plan.period}</span>
                        </div>
                        {plan.recommended && (
                            <div className="recommended-badge">
                                <Star size={16} fill="currentColor" /> Most Popular
                            </div>
                        )}
                        <Link to={`/checkout/${plan.id}`} className="btn btn-primary btn-block btn-large">
                            Get Started Now
                        </Link>
                    </div>

                    <div className="detail-card benefits-section">
                        <h3>What's Included?</h3>
                        <ul className="benefits-list">
                            {plan.details.benefits.map((benefit, index) => (
                                <li key={index}>
                                    <CheckCircle className="check-icon" size={20} />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="detail-card highlights-section">
                        <h3>Why Choose This Plan?</h3>
                        <div className="highlights-grid">
                            {plan.highlights && plan.highlights.map((highlight, index) => (
                                <div key={index} className="highlight-card">
                                    <h4>{highlight.title}</h4>
                                    <p>{highlight.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="detail-card features-breakdown">
                        <h3>Feature Breakdown</h3>
                        <ul className="features-list">
                            {plan.features.map((feature, index) => (
                                <li key={index} className={feature.included ? 'included' : 'excluded'}>
                                    <span className="feature-name">{feature.name}</span>
                                    <span className="status">{feature.included ? 'Included' : 'Not Included'}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="detail-card terms-section">
                        <h3>Terms & Conditions</h3>
                        <p>{plan.details.terms}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembershipDetail;
