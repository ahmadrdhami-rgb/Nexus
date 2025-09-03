import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Calendar, TrendingUp, AlertCircle, PlusCircle, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { CollaborationRequest } from '../../types';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { investors } from '../../data/users';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Joyride from 'react-joyride'; // For walkthrough

interface Event {
  title: string;
  date: string;
  status?: 'confirmed' | 'pending';
}

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [recommendedInvestors, setRecommendedInvestors] = useState(investors.slice(0, 3));
  const [events, setEvents] = useState<Event[]>([]);
  const [walletBalance, setWalletBalance] = useState(1000); // Mock wallet balance
  const [transactions, setTransactions] = useState<any[]>([]); // Mock transactions
  const [runWalkthrough, setRunWalkthrough] = useState(true); // For Joyride

  useEffect(() => {
    if (user) {
      const requests = getRequestsForEntrepreneur(user.id);
      setCollaborationRequests(requests);
      const confirmedEvents = requests
        .filter(req => req.status === 'accepted')
        .map(req => ({
          title: `Meeting with ${req.investorName}`,
          date: new Date().toISOString().split('T')[0],
          status: 'confirmed',
        }));
      setEvents(confirmedEvents);
    }
  }, [user]);

  const handleRequestStatusUpdate = (requestId: string, status: 'accepted' | 'rejected') => {
    setCollaborationRequests(prevRequests =>
      prevRequests.map(req => (req.id === requestId ? { ...req, status } : req))
    );
    if (status === 'accepted') {
      const updatedRequest = collaborationRequests.find(req => req.id === requestId);
      if (updatedRequest) {
        setEvents([...events, {
          title: `Meeting with ${updatedRequest.investorName}`,
          date: new Date().toISOString().split('T')[0],
          status: 'confirmed',
        }]);
      }
    }
  };

  const handleDateClick = (arg: { dateStr: string }) => {
    const title = prompt('Enter meeting title:');
    if (title) {
      setEvents([...events, { title, date: arg.dateStr, status: 'pending' }]);
    }
  };

  const handleFunding = (amount: number) => {
    if (amount > 0 && amount <= walletBalance) {
      setWalletBalance(walletBalance - amount);
      setTransactions([...transactions, {
        id: Date.now().toString(),
        amount: -amount,
        sender: 'Investor',
        receiver: user.name,
        status: 'Completed',
        date: new Date().toLocaleDateString(),
      }]);
      alert('Funding received (mock)');
    } else {
      alert('Insufficient balance or invalid amount');
    }
  };

  // Define missing handler functions
  const handleSendRequest = () => {
    // Mock implementation: Add a new pending request
    const newRequest: CollaborationRequest = {
      id: Date.now().toString(),
      entrepreneurId: user.id,
      entrepreneurName: user.name,
      investorId: recommendedInvestors[0].id, // Use first recommended investor as mock
      investorName: recommendedInvestors[0].name,
      status: 'pending',
      pitchSummary: 'New pitch summary',
      dateRequested: new Date().toISOString(),
    };
    setCollaborationRequests([...collaborationRequests, newRequest]);
    alert('Request sent (mock)');
  };

  const handleAccept = (requestId: string) => {
    handleRequestStatusUpdate(requestId, 'accepted');
    alert('Request accepted (mock)');
  };

  const handleDecline = (requestId: string) => {
    handleRequestStatusUpdate(requestId, 'rejected');
    alert('Request declined (mock)');
  };

  const steps = [
    { target: '.card-requests', content: 'View your collaboration requests here.' },
    { target: '.card-investors', content: 'Check recommended investors.' },
    { target: '.card-calendar', content: 'Manage your meeting schedule.' },
    { target: '.card-wallet', content: 'Track your wallet balance and funding.' },
  ];

  if (!user) return null;

  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <Joyride steps={steps} run={runWalkthrough} continuous={true} callback={() => setRunWalkthrough(false)} />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-600">Here's what's happening with your startup today</p>
        </div>
        <Link to="/investors">
          <Button leftIcon={<PlusCircle size={18} />}>Find Investors</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-50 border border-primary-100 card-requests">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Bell size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Pending Requests</p>
                <h3 className="text-xl font-semibold text-primary-900">{pendingRequests.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <Users size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Total Connections</p>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {collaborationRequests.filter(req => req.status === 'accepted').length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-accent-50 border border-accent-100 card-calendar">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Calendar size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Upcoming Meetings</p>
                <h3 className="text-xl font-semibold text-accent-900">{events.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-success-50 border border-success-100 card-wallet">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-full mr-4">
                <DollarSign size={20} className="text-success-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-700">Wallet Balance</p>
                <h3 className="text-xl font-semibold text-success-900">${walletBalance}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Collaboration Requests</h2>
              <Badge variant="primary">{pendingRequests.length} pending</Badge>
            </CardHeader>
            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map(request => (
                    <CollaborationRequestCard
                      key={request.id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <AlertCircle size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No collaboration requests yet</p>
                  <p className="text-sm text-gray-500 mt-1">When investors are interested in your startup, their requests will appear here</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="card-investors">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Recommended Investors</h2>
              <Link to="/investors" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </CardHeader>
            <CardBody className="space-y-4">
              {recommendedInvestors.map(investor => (
                <InvestorCard
                  key={investor.id}
                  investor={investor}
                  showActions={false}
                />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>

      <Card className="card-calendar">
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Meeting Schedule</h2>
        </CardHeader>
        <CardBody>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            events={events}
            dateClick={handleDateClick}
            eventContent={(eventInfo) => (
              <div>
                <b>{eventInfo.event.title}</b>
                <p>{eventInfo.event.extendedProps.status}</p>
              </div>
            )}
          />
          <div className="mt-4 space-x-2">
            <Button onClick={handleSendRequest}>Send Request</Button> {/* Now defined */}
            <Button onClick={() => handleAccept('mock-id')}>Accept</Button> {/* Mock ID for demo */}
            <Button onClick={() => handleDecline('mock-id')}>Decline</Button> {/* Mock ID for demo */}
            <Button onClick={() => handleFunding(100)}>Request Funding</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default EntrepreneurDashboard;