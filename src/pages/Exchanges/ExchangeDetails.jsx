import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Alert, ListGroup } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiArrowLeft, FiArrowRight, FiClock, FiTag, FiUser, FiMapPin, FiAlertTriangle,
    FiCalendar, FiCheckCircle, FiXCircle, FiMessageCircle, FiRefreshCw
} from 'react-icons/fi';
import DashboardNavbar from '../../components/dashboard/DashboardNavbar/DashboardNavbar';
import Loader from '../../components/common/Loader/Loader';
import exchangesService from '../../services/exchangesService';
import authService from '../../services/authService';
import './ExchangeDetails.css';

const ExchangeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exchange, setExchange] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const currentUser = authService.getCurrentUser();
    const currentUserId = currentUser?.user?.user_id;

    useEffect(() => {
        fetchExchangeDetails();
    }, [id]);

    const fetchExchangeDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const exchangeData = await exchangesService.getExchangeById(id);
            setExchange(exchangeData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching exchange details:', err);
            setError('Failed to load exchange details. Please try again later.');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            setLoading(true);
            const response = await exchangesService.updateExchangeStatus(id, newStatus);
            setExchange(response.exchange);
            setSuccessMessage(`Exchange ${newStatus} successfully`);
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            setLoading(false);
        } catch (err) {
            console.error('Error updating exchange status:', err);
            setError(err.response?.data?.message || 'Failed to update exchange status. Please try again.');
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <Badge bg="warning" className="pulse">Pending</Badge>;
            case 'accepted':
                return <Badge bg="info" className="pulse">Accepted</Badge>;
            case 'completed':
                return <Badge bg="success" className="pulse">Completed</Badge>;
            case 'canceled':
                return <Badge bg="danger" className="pulse">Canceled</Badge>;
            default:
                return null;
        }
    };

    const getModeIcon = (mode) => {
        switch (mode) {
            case 'online':
                return <Badge bg="info">Online</Badge>;
            case 'in-person':
                return <Badge bg="success">In-Person</Badge>;
            case 'both':
                return <Badge bg="primary">Hybrid</Badge>;
            default:
                return null;
        }
    };

    const getUrgencyBadge = (urgency) => {
        if (!urgency) return null;

        switch (urgency) {
            case 'high':
                return <Badge bg="danger">High Priority</Badge>;
            case 'medium':
                return <Badge bg="warning">Medium Priority</Badge>;
            case 'low':
                return <Badge bg="success">Low Priority</Badge>;
            default:
                return null;
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <DashboardNavbar />
                <Container className="dashboard-main">
                    <div className="page-header">
                        <motion.div whileHover={{ x: -5 }}>
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate('/exchanges')}
                                className="back-btn"
                            >
                                <FiArrowLeft /> Back to Exchanges
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Alert variant="danger" className="mb-4 error-alert">
                            <div className="d-flex align-items-center">
                                <div className="me-3 flex-shrink-0">
                                    <FiAlertTriangle size={24} />
                                </div>
                                <div className="flex-grow-1">
                                    <p className="mb-0">{error}</p>
                                </div>
                                <div>
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={fetchExchangeDetails}
                                            className="d-flex align-items-center retry-btn"
                                        >
                                            <FiRefreshCw className="me-1" /> Retry
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </Alert>
                    </motion.div>
                </Container>
            </div>
        );
    }

    if (!exchange) {
        return (
            <div className="dashboard-container">
                <DashboardNavbar />
                <Container className="dashboard-main">
                    <div className="page-header">
                        <motion.div whileHover={{ x: -5 }}>
                            <Button
                                variant="outline-secondary"
                                onClick={() => navigate('/exchanges')}
                                className="back-btn"
                            >
                                <FiArrowLeft /> Back to Exchanges
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Alert variant="warning" className="not-found-alert">
                            Exchange not found or you don't have permission to view it.
                        </Alert>
                    </motion.div>
                </Container>
            </div>
        );
    }

    const isProvider = exchange.provider_id === currentUserId;

    return (
        <div className="dashboard-container">
            <DashboardNavbar />

            <Container className="dashboard-main">
                <div className="page-header">
                    <motion.div whileHover={{ x: -5 }}>
                        <Button
                            variant="outline-secondary"
                            onClick={() => navigate('/exchanges')}
                            className="back-btn"
                        >
                            <FiArrowLeft /> Back to Exchanges
                        </Button>
                    </motion.div>

                    <div className="status-badge">
                        {getStatusBadge(exchange.status)}
                    </div>
                </div>

                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible className="success-alert">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        {successMessage}
                                    </div>
                                    <FiArrowRight className="ms-2" />
                                </div>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="exchange-layout-container">
                    <div className="exchange-content">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="exchange-card">
                                <Card.Body>
                                    <motion.h2
                                        className="exchange-main-title"
                                        whileHover={{ color: 'var(--aui-primary-dark)' }}
                                    >
                                        Exchange Details
                                    </motion.h2>

                                    <div className="exchange-section">
                                        <h3 className="section-title">Exchange Summary</h3>
                                        <div className="exchange-meta mb-4">
                                            <motion.div
                                                className="meta-badge"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <FiUser className="meta-icon" />
                                                <span>Your Role: {isProvider ? 'Provider' : 'Requester'}</span>
                                            </motion.div>
                                            <motion.div
                                                className="meta-badge"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <FiTag className="meta-icon" />
                                                <span>{exchange.skill_name}</span>
                                            </motion.div>
                                            <motion.div
                                                className="meta-badge"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <FiClock className="meta-icon" />
                                                <span>Created: {formatDate(exchange.created_at)}</span>
                                            </motion.div>
                                        </div>

                                        <Row className="mb-4">
                                            <Col md={6}>
                                                <motion.div
                                                    className="participant-card provider"
                                                    whileHover={{ y: -3 }}
                                                >
                                                    <h4>Provider</h4>
                                                    <p className="participant-name">{exchange.provider_name}</p>
                                                    <p className="participant-email">{exchange.provider_email}</p>
                                                </motion.div>
                                            </Col>
                                            <Col md={6}>
                                                <motion.div
                                                    className="participant-card requester"
                                                    whileHover={{ y: -3 }}
                                                >
                                                    <h4>Requester</h4>
                                                    <p className="participant-name">{exchange.requester_name}</p>
                                                    <p className="participant-email">{exchange.requester_email}</p>
                                                </motion.div>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="exchange-section">
                                        <h3 className="section-title">Offering Details</h3>
                                        <motion.div whileHover={{ y: -3 }}>
                                            <Card className="inner-card offering-card">
                                                <Card.Body>
                                                    <Card.Title>{exchange.offering_title}</Card.Title>
                                                    <div className="offering-meta">
                                                        {getModeIcon(exchange.offering_mode)}
                                                    </div>
                                                    <Card.Text className="mt-3">
                                                        {exchange.offering_description}
                                                    </Card.Text>
                                                    <ListGroup variant="flush" className="mt-3">
                                                        <ListGroup.Item className="d-flex align-items-center">
                                                            <FiCalendar className="me-2 text-primary" />
                                                            <span>Availability: {exchange.offering_availability}</span>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item className="d-flex align-items-center">
                                                            <FiMapPin className="me-2 text-primary" />
                                                            <span>
                                                                Mode:{' '}
                                                                {exchange.offering_mode
                                                                    ? exchange.offering_mode.charAt(0).toUpperCase() + exchange.offering_mode.slice(1)
                                                                    : 'N/A'}
                                                            </span>
                                                        </ListGroup.Item>
                                                    </ListGroup>
                                                </Card.Body>
                                            </Card>
                                        </motion.div>
                                    </div>

                                    {exchange.request_id && (
                                        <div className="exchange-section">
                                            <h3 className="section-title">Request Details</h3>
                                            <motion.div whileHover={{ y: -3 }}>
                                                <Card className="inner-card request-card">
                                                    <Card.Body>
                                                        <Card.Title>{exchange.request_title}</Card.Title>
                                                        <div className="request-meta">
                                                            {getUrgencyBadge(exchange.request_urgency)}
                                                        </div>
                                                        <Card.Text className="mt-3">
                                                            {exchange.request_description}
                                                        </Card.Text>
                                                        <ListGroup variant="flush" className="mt-3">
                                                            <ListGroup.Item className="d-flex align-items-center">
                                                                <FiCalendar className="me-2 text-primary" />
                                                                <span>Timeframe: {exchange.request_timeframe}</span>
                                                            </ListGroup.Item>
                                                            {exchange.request_urgency && (
                                                                <ListGroup.Item className="d-flex align-items-center">
                                                                    <FiAlertTriangle className="me-2 text-primary" />
                                                                    <span>Urgency: {exchange.request_urgency.charAt(0).toUpperCase() + exchange.request_urgency.slice(1)}</span>
                                                                </ListGroup.Item>
                                                            )}
                                                        </ListGroup>
                                                    </Card.Body>
                                                </Card>
                                            </motion.div>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </div>

                    <div className="exchange-sidebar">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <Card className="status-card">
                                <Card.Body>
                                    <Card.Title>Exchange Status</Card.Title>

                                    <div className="status-timeline">
                                        <div className="timeline-item">
                                            <div className={`timeline-point ${exchange.status === 'pending' || exchange.status === 'accepted' || exchange.status === 'completed' ? 'active' : ''}`}>
                                                1
                                            </div>
                                            <div className="timeline-content">
                                                <h5>Created</h5>
                                                <p>{formatDate(exchange.created_at)}</p>
                                                <p className="text-muted">Exchange was created</p>
                                            </div>
                                        </div>

                                        <div className="timeline-item">
                                            <div className={`timeline-point ${exchange.status === 'accepted' || exchange.status === 'completed' ? 'active' : ''}`}>
                                                2
                                            </div>
                                            <div className="timeline-content">
                                                <h5>Accepted</h5>
                                                {exchange.status === 'accepted' || exchange.status === 'completed' ? (
                                                    <p>{formatDate(exchange.updated_at)}</p>
                                                ) : (
                                                    <p className="text-muted">Pending provider approval</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="timeline-item">
                                            <div className={`timeline-point ${exchange.status === 'completed' ? 'active' : ''}`}>
                                                3
                                            </div>
                                            <div className="timeline-content">
                                                <h5>Completed</h5>
                                                {exchange.status === 'completed' ? (
                                                    <p>{formatDate(exchange.updated_at)}</p>
                                                ) : (
                                                    <p className="text-muted">
                                                        {exchange.status === 'canceled' ? 'Exchange was canceled' : 'Waiting for completion'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className="actions-card">
                                <Card.Body>
                                    <Card.Title>Actions</Card.Title>

                                    <div className="exchange-actions">
                                        {exchange.status === 'pending' && isProvider && (
                                            <motion.div whileHover={{ scale: 1.02 }}>
                                                <Button
                                                    variant="success"
                                                    className="mb-2 w-100 action-btn"
                                                    onClick={() => handleStatusUpdate('accepted')}
                                                >
                                                    <FiCheckCircle className="me-2" /> Accept
                                                </Button>
                                            </motion.div>
                                        )}

                                        {exchange.status === 'accepted' && !isProvider && (
                                            <motion.div whileHover={{ scale: 1.02 }}>
                                                <Button
                                                    variant="success"
                                                    className="mb-2 w-100 action-btn"
                                                    onClick={() => handleStatusUpdate('completed')}
                                                >
                                                    <FiCheckCircle className="me-2" /> Complete
                                                </Button>
                                            </motion.div>
                                        )}

                                        {(exchange.status === 'pending' || exchange.status === 'accepted') && (
                                            <motion.div whileHover={{ scale: 1.02 }}>
                                                <Button
                                                    variant="danger"
                                                    className="mb-3 w-100 action-btn"
                                                    onClick={() => handleStatusUpdate('canceled')}
                                                >
                                                    <FiXCircle className="me-2" /> Cancel
                                                </Button>
                                            </motion.div>
                                        )}

                                        <motion.div whileHover={{ scale: 1.02 }}>
                                            <Button
                                                variant="outline-primary"
                                                as={Link}
                                                to={`/offerings/${exchange.offering_id}`}
                                                className="mb-2 w-100 action-btn"
                                            >
                                                View Offering
                                            </Button>
                                        </motion.div>

                                        {exchange.request_id && (
                                            <motion.div whileHover={{ scale: 1.02 }}>
                                                <Button
                                                    variant="outline-primary"
                                                    as={Link}
                                                    to={`/requests/${exchange.request_id}`}
                                                    className="mb-2 w-100 action-btn"
                                                >
                                                    View Request
                                                </Button>
                                            </motion.div>
                                        )}

                                        <div className="contact-section mt-4">
                                            <h5>Need to discuss?</h5>
                                            <p className="text-muted">Contact {isProvider ? 'requester' : 'provider'} directly:</p>
                                            <motion.div whileHover={{ scale: 1.02 }}>
                                                <Button
                                                    variant="primary"
                                                    className="w-100 action-btn"
                                                    as="a"
                                                    href={`mailto:${isProvider ? exchange.requester_email : exchange.provider_email}`}
                                                >
                                                    <FiMessageCircle className="me-2" /> Send Email
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ExchangeDetails;