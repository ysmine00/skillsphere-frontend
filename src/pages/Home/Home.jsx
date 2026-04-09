import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header/Header';
import Footer from '../../components/common/Footer/Footer';
import './Home.css';
import heroImage from '../../assets/images/hero-image.jpg';

// Import SVG directly as components (React 17+)
import { ReactComponent as OfferIcon } from '../../assets/images/offer-icon.svg';
import { ReactComponent as ExchangeIcon } from '../../assets/images/exchange-icon.svg';
import { ReactComponent as CommunityIcon } from '../../assets/images/community-icon.svg';

const Home = () => {
    // Sample stats data - in a real app, this might come from an API
    const stats = [
        { label: 'Registered Users', value: '500+' },
        { label: 'Skills Offered', value: '120+' },
        { label: 'Categories', value: '15' },
        { label: 'Successful Exchanges', value: '250+' },
    ];

    // Sample testimonials - in a real app, this would come from an API
    const testimonials = [
        {
            id: 1,
            text: "SkillSphere helped me connect with a computer science student who taught me Python basics in exchange for French language practice. It's been a game-changer for my research project!",
            author: "Dr. Sarah Ahmed",
            role: "Faculty, Business Administration"
        },
        {
            id: 2,
            text: "I've been able to share my guitar skills with fellow students and in return learned graphic design. The platform makes it easy to find people with complementary skills.",
            author: "Mohammed Tazi",
            role: "Student, Engineering"
        },
        {
            id: 3,
            text: "As a staff member, I've found SkillSphere to be a wonderful way to connect with students and faculty outside my department. I've taught cooking classes and learned photography!",
            author: "Laila Benjelloun",
            role: "Staff, Student Affairs"
        }
    ];

    return (
        <div className="home-page">
            <Header />

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">Share Knowledge, Grow Together</h1>
                    <p className="hero-subtitle">
                        SkillSphere connects the AUI community to exchange skills, knowledge, and expertise.
                    </p>
                    <div className="hero-cta">
                        <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
                        <Link to="/offerings" className="btn btn-secondary btn-lg">Explore Skills</Link>
                    </div>
                </div>
                <div className="hero-image">
                    <img src={heroImage} alt="SkillSphere Platform" className="hero-img" />
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="section-container">
                    <h2 className="section-title">How SkillSphere Works</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <OfferIcon />
                            </div>
                            <h3 className="feature-title">Share Your Skills</h3>
                            <p className="feature-description">
                                Create a profile showcasing your skills and expertise. Specify your availability and preferred teaching methods.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <ExchangeIcon />
                            </div>
                            <h3 className="feature-title">Find What You Need</h3>
                            <p className="feature-description">
                                Browse available skills or post a specific request. Connect with community members who have what you're looking for.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <CommunityIcon />
                            </div>
                            <h3 className="feature-title">Build Community</h3>
                            <p className="feature-description">
                                Exchange skills, grow your network, and strengthen the AUI community through collaborative learning.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="section-container">
                    <h2 className="section-title">Our Impact</h2>
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div className="stat-card" key={index}>
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials">
                <div className="section-container">
                    <h2 className="section-title">What Our Community Says</h2>
                    <div className="testimonials-grid">
                        {testimonials.map(testimonial => (
                            <div className="testimonial-card" key={testimonial.id}>
                                <div className="testimonial-content">
                                    <p className="testimonial-text">"{testimonial.text}"</p>
                                    <div className="testimonial-author">
                                        <p className="author-name">{testimonial.author}</p>
                                        <p className="author-role">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="section-container">
                    <h2 className="cta-title">Ready to Start Sharing Skills?</h2>
                    <p className="cta-description">
                        Join the SkillSphere community today and discover the power of skill exchange!
                    </p>
                    <div className="cta-buttons">
                        <Link to="/register" className="btn btn-primary btn-lg">Create Account</Link>
                        <Link to="/login" className="btn btn-secondary btn-lg">Log In</Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;