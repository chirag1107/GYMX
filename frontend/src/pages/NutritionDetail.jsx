import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { nutritionTopics } from '../data/nutrition';
import './NutritionDetail.css';

const NutritionDetail = () => {
    const { id } = useParams();
    const topic = nutritionTopics.find(t => t.id === id);

    if (!topic) {
        return (
            <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>
                <h2>Topic not found</h2>
                <Link to="/nutrition" className="btn btn-primary">Back to Nutrition</Link>
            </div>
        );
    }

    return (
        <div className="nutrition-detail-page page-content">
            <div className="container">
                <Link to="/nutrition" className="back-link"><ArrowLeft size={20} /> Back to Nutrition</Link>

                <div className="topic-header" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${topic.bannerImage})` }}>
                    <h1>{topic.title}</h1>
                    <p>{topic.description}</p>
                </div>

                <div className="items-grid">
                    {topic.items.map((item, index) => (
                        <Link to={`/nutrition/${id}/${item.id}`} key={index} className="item-card">
                            <img src={item.image} alt={item.name} className="item-image" />
                            <div className="item-content">
                                <h3>{item.name}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NutritionDetail;
