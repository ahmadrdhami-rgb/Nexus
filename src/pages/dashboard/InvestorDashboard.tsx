import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { useAuth } from '../../context/AuthContext';
import { Entrepreneur } from '../../types';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';
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

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [events, setEvents] = useState<Event[]>([
    { title: 'Sample Meeting', date: '2025-09-01T10:00:00', status: 'confirmed' },
  ]);
  const [walletBalance, setWalletBalance] = useState(5000); // Mock wallet balance
  const [transactions, setTransactions] = useState<any[]>([]); // Mock transactions
  const [runWalkthrough, setRunWalkthrough] = useState(true); // For Joyride

  const sentRequests = getRequestsFromInvestor(user.id);
  const requestedEntrepreneurIds = sentRequests.map(req => req.entrepreneurId);

  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch = searchQuery === '' ||
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = selectedIndustries.length === 0 ||
      selectedIndustries.includes(entrepreneur.industry);
    
    return matchesSearch && matchesIndustry && !requestedEntrepreneurIds.includes(entrepreneur.id);
  });

  const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prevSelected =>
      prevSelected.includes(industry)
        ? prevSelected.filter(i => i !== industry)
        : [...prevSelected, industry]
    );
  };

  const handleDateClick = (arg: { dateStr: string }) => {
    const title = prompt('Enter meeting title:');
    if (title) {
      setEvents([...events, { title, date: arg.dateStr, status: 'pending' }]);
    }
  };

  const handleFunding = (amount: number, entrepreneurName: string) => {
    if (amount > 0 && amount <= walletBalance) {
      setWalletBalance(walletBalance - amount);
      setTransactions([...transactions, {
        id: Date.now().toString(),
        amount: -amount,
        sender: user.name,
        receiver: entrepreneurName,
        status: 'Completed',
        date: new Date().toLocaleDateString(),
      }]);
      alert(`Funding ${amount} sent to ${entrepreneurName} (mock)`);
    } else {
      alert('Insufficient balance or invalid amount');
    }
  };

  const steps = [
    { target: '.card-startups', content: 'Discover startups to invest in.' },
    { target: '.card-industries', content: 'Filter by industries.' },
    { target: '.card-connections', content: 'Track your connections.' },
    { target: '.card-wallet', content: 'Manage your wallet and fund deals.' },
  ];

  if (!user) return null;

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <Joyride steps={steps} run={runWalkthrough} continuous={true} callback={() => setRunWalkthrough(false)} />
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discover Startups</h1>
          <p className="text-gray-600">Find and connect with promising entrepreneurs</p>
        </div>
        <Link to="/entrepreneurs">
          <Button leftIcon={<PlusCircle size={18} />}>View All Startups</Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search startups, industries, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={<Search size={18} />}
          />
        </div>
        <div className="w-full md:w-1/3">
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            <div className="flex flex-wrap gap-2">
              {industries.map(industry => (
                <Badge
                  key={industry}
                  variant={selectedIndustries.includes(industry) ? 'primary' : 'gray'}
                  className="cursor-pointer"
                  onClick={() => toggleIndustry(industry)}
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary-50 border border-primary-100 card-startups">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Users size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">Total Startups</p>
                <h3 className="text-xl font-semibold text-primary-900">{entrepreneurs.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-secondary-50 border border-secondary-100 card-industries">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <PieChart size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">Industries</p>
                <h3 className="text-xl font-semibold text-secondary-900">{industries.length}</h3>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-accent-50 border border-accent-100 card-connections">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Users size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">Your Connections</p>
                <h3 className="text-xl font-semibold text-accent-900">
                  {sentRequests.filter(req => req.status === 'accepted').length}
                </h3>
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

      <div>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Featured Startups</h2>
          </CardHeader>
          <CardBody>
            {filteredEntrepreneurs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntrepreneurs.map(entrepreneur => (
                  <EntrepreneurCard
                    key={entrepreneur.id}
                    entrepreneur={entrepreneur}
                    onFund={(amount) => handleFunding(amount, entrepreneur.name)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No startups match your filters</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustries([]);
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
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
            <Button onClick={handleSendRequest}>Send Request</Button>
            <Button onClick={handleAccept}>Accept</Button>
            <Button onClick={handleDecline}>Decline</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default InvestorDashboard;