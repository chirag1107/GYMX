import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { nutritionTopics } from '../data/nutrition';
import './NutritionDetail.css'; // Reusing existing CSS

const NutritionItemDetail = () => {
    const { id, itemId } = useParams();
    const topic = nutritionTopics.find(t => t.id === id);

    if (!topic) return <div>Topic not found</div>;

    const item = topic.items.find(i => i.id === itemId);

    if (!item) {
        return (
            <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>
                <h2>Item not found</h2>
                <Link to={`/nutrition/${id}`} className="btn btn-primary">Back to {topic.title}</Link>
            </div>
        );
    }

    return (
        <div className="nutrition-detail-page page-content">
            <div className="container">
                <Link to={`/nutrition/${id}`} className="back-link">
                    <ArrowLeft size={20} /> Back to {topic.title}
                </Link>

                <div className="item-detail-container">
                    <div className="item-hero" style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${item.image})`,
                        height: '400px',
                        borderRadius: '20px',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        padding: '3rem',
                        marginBottom: '3rem'
                    }}>
                        <span style={{
                            background: 'var(--primary-color)',
                            color: '#000',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                            display: 'inline-block',
                            maxWidth: 'fit-content'
                        }}>
                            Protein: {item.protein}
                        </span>
                        <h1 style={{ fontSize: '3.5rem', margin: 0 }}>{item.name}</h1>
                    </div>

                    <div className="item-content-body" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="card" style={{ padding: '3rem' }}>
                            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Benefits & Overview</h2>
                            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#ddd' }}>
                                {item.details}
                            </p>

                            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--card-border)' }}>
                                <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Quick Summary</h3>
                                <p style={{ color: '#aaa' }}>{item.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NutritionItemDetail;
